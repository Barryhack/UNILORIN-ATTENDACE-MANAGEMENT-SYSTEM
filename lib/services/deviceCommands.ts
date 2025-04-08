import { deviceSocket } from './deviceSocket'

export interface DeviceCommandOptions {
  timeout?: number
  retries?: number
}

export class DeviceCommandService {
  private static DEFAULT_TIMEOUT = 30000 // 30 seconds
  private static DEFAULT_RETRIES = 2

  static async sendCommand(
    command: string,
    payload?: any,
    options: DeviceCommandOptions = {}
  ): Promise<any> {
    const timeout = options.timeout || this.DEFAULT_TIMEOUT
    const retries = options.retries || this.DEFAULT_RETRIES
    let attempts = 0

    while (attempts <= retries) {
      try {
        const response = await this.executeCommand(command, payload, timeout)
        return response
      } catch (error) {
        attempts++
        if (attempts > retries) throw error
        await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1s between retries
      }
    }
  }

  private static executeCommand(command: string, payload?: any, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Command ${command} timed out after ${timeout}ms`))
      }, timeout)

      const messageHandler = (response: any) => {
        if (response.command === command) {
          cleanup()
          if (response.status === 'error') {
            reject(new Error(response.message))
          } else {
            resolve(response.data)
          }
        }
      }

      const errorHandler = (error: Error) => {
        cleanup()
        reject(error)
      }

      const cleanup = () => {
        clearTimeout(timeoutId)
        deviceSocket.off('message', messageHandler)
        deviceSocket.off('error', errorHandler)
      }

      deviceSocket.on('message', messageHandler)
      deviceSocket.on('error', errorHandler)

      try {
        deviceSocket.sendCommand({ command, payload })
      } catch (error) {
        cleanup()
        reject(error)
      }
    })
  }
} 