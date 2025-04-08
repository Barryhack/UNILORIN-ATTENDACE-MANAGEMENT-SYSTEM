import { DeviceCommandService } from './deviceCommands'

export interface SyncStatus {
  lastSync: Date
  pendingRecords: number
  syncing: boolean
}

export class SyncService {
  private static status: SyncStatus = {
    lastSync: new Date(0),
    pendingRecords: 0,
    syncing: false
  }

  static async startSync(): Promise<void> {
    if (this.status.syncing) return

    this.status.syncing = true
    try {
      const result = await DeviceCommandService.sendCommand('START_SYNC')
      this.status.lastSync = new Date()
      this.status.pendingRecords = 0
      return result
    } finally {
      this.status.syncing = false
    }
  }

  static async getPendingRecords(): Promise<number> {
    const result = await DeviceCommandService.sendCommand('GET_PENDING_RECORDS')
    this.status.pendingRecords = result.count
    return result.count
  }

  static getStatus(): SyncStatus {
    return { ...this.status }
  }
} 