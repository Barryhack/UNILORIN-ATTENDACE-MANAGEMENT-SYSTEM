import { WebSocket, MessageEvent, ErrorEvent } from 'ws'
import { EventEmitter } from "events"

interface DeviceCommand {
  command: string
  payload?: unknown
  timestamp?: number
}

interface DeviceResponse {
  type: string
  status: 'success' | 'error' | 'info'
  data?: unknown
  message?: string
  timestamp: number
}

interface DeviceStatus {
  connected: boolean
  sdCard: boolean
  fingerprint: boolean
  rfid: boolean
  display: boolean
}

export class DeviceSocketService extends EventEmitter {
  private socket: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectTimeout = 5000
  private deviceStatus: DeviceStatus = {
    connected: false,
    sdCard: false,
    fingerprint: false,
    rfid: false,
    display: false
  }

  constructor() {
    super()
  }

  async connect(deviceIp: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Connect to ESP32 WebSocket server
        this.socket = new WebSocket(`ws://${deviceIp}/ws`)

        this.socket.on('open', () => {
          this.reconnectAttempts = 0
          this.deviceStatus.connected = true
          
          // Request device components status
          this.sendCommand({
            command: 'GET_DEVICE_STATUS'
          })
          
          this.emit('connected')
          resolve()
        })

        this.socket.on('message', (data) => {
          try {
            const response: DeviceResponse = JSON.parse(data.toString())
            
            switch (response.type) {
              case 'DEVICE_STATUS':
                this.handleDeviceStatus(response.data as Partial<DeviceStatus>)
                break
                
              case 'FINGERPRINT_SCAN':
                this.handleFingerprintScan(response)
                break
                
              case 'RFID_SCAN':
                this.handleRfidScan(response)
                break
                
              case 'SYNC_STATUS':
                this.handleSyncStatus(response)
                break
                
              case 'ERROR':
                this.emit('error', new Error(response.message))
                break
            }
            
            this.emit('message', response)
          } catch (error) {
            this.emit('error', new Error('Invalid message format from device'))
          }
        })

        this.socket.on('close', () => {
          this.deviceStatus.connected = false
          this.emit('disconnected')
          this.handleReconnect(deviceIp)
        })

        this.socket.on('error', (error) => {
          this.emit('error', error)
          reject(error)
        })

      } catch (error) {
        reject(error)
      }
    })
  }

  private handleDeviceStatus(status: Partial<DeviceStatus>): void {
    this.deviceStatus = {
      ...this.deviceStatus,
      ...status
    }
    this.emit('status', this.deviceStatus)
  }

  private handleFingerprintScan(response: DeviceResponse): void {
    if (response.status === 'success' && response.data) {
      this.emit('fingerprint', {
        success: true,
        fingerprintId: (response.data as { fingerprintId: string }).fingerprintId,
        quality: (response.data as { quality: number }).quality
      })
    } else {
      this.emit('fingerprint', {
        success: false,
        error: response.message
      })
    }
  }

  private handleRfidScan(response: DeviceResponse) {
    if (response.status === 'success') {
      this.emit('rfid', {
        success: true,
        cardId: response.data.cardId
      })
    } else {
      this.emit('rfid', {
        success: false,
        error: response.message
      })
    }
  }

  private handleSyncStatus(response: DeviceResponse) {
    this.emit('sync', {
      status: response.status,
      recordsSynced: response.data?.recordsSynced,
      lastSync: response.data?.lastSync
    })
  }

  sendCommand(command: DeviceCommand): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        ...command,
        timestamp: Date.now()
      }))
    } else {
      throw new Error('Device not connected')
    }
  }

  private handleReconnect(deviceIp: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect(deviceIp)
      }, this.reconnectTimeout)
    } else {
      this.emit('error', new Error('Max reconnection attempts reached'))
    }
  }

  getDeviceStatus() {
    return this.deviceStatus
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
      this.deviceStatus.connected = false
    }
  }
}

export const deviceSocket = new DeviceSocketService() 