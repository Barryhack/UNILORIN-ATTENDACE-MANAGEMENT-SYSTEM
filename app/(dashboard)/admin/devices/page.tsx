"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { deviceSocket } from "@/lib/services/deviceSocket"
import { DeviceCommandService } from "@/lib/services/deviceCommands"
import {
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
  Loader2,
  Settings,
  RotateCcw,
} from "lucide-react"

interface DeviceStatus {
  connected: boolean
  ready: boolean
  mode: 'idle' | 'registration' | 'attendance' | 'error'
  lastSync: string | null
  error: string | null
}

export default function DeviceManagement() {
  const [deviceIp, setDeviceIp] = useState("192.168.1.100")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    connected: false,
    ready: false,
    mode: 'idle',
    lastSync: null,
    error: null
  })

  useEffect(() => {
    deviceSocket.on('status', (status) => {
      setDeviceStatus(status)
    })

    deviceSocket.on('sync', (status) => {
      if (status.status === 'success') {
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${status.recordsSynced} records`
        })
        setIsSyncing(false)
      }
    })

    return () => {
      deviceSocket.removeAllListeners()
    }
  }, [])

  const connectDevice = async () => {
    try {
      setIsConnecting(true)
      await deviceSocket.connect(deviceIp)
      toast({
        title: "Success",
        description: "Connected to attendance system"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect to attendance system"
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectDevice = () => {
    deviceSocket.disconnect()
    toast({
      title: "Disconnected",
      description: "Attendance system disconnected"
    })
  }

  const syncData = async () => {
    try {
      setIsSyncing(true)
      await DeviceCommandService.sendCommand('START_SYNC')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sync attendance records"
      })
      setIsSyncing(false)
    }
  }

  const resetDevice = async () => {
    try {
      await DeviceCommandService.sendCommand('RESET_DEVICE')
      toast({
        title: "Success",
        description: "Attendance system reset successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reset attendance system"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
        <p className="text-muted-foreground">
          Manage the attendance system device
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="deviceIp">System IP Address</Label>
                <Input
                  id="deviceIp"
                  value={deviceIp}
                  onChange={(e) => setDeviceIp(e.target.value)}
                  placeholder="Enter device IP address"
                />
              </div>
              <div className="self-end">
                {deviceStatus.connected ? (
                  <Button variant="outline" onClick={disconnectDevice}>
                    <WifiOff className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={connectDevice} disabled={isConnecting}>
                    {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wifi className="mr-2 h-4 w-4" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>System Status</span>
                  </div>
                  <Badge 
                    variant={deviceStatus.ready ? "default" : "destructive"}
                  >
                    {deviceStatus.ready ? (
                      <>
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Ready
                      </>
                    ) : (
                      <>
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Not Ready
                      </>
                    )}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Current Mode</span>
                  </div>
                  <Badge variant="secondary">
                    {deviceStatus.mode.charAt(0).toUpperCase() + deviceStatus.mode.slice(1)}
                  </Badge>
                </div>

                {deviceStatus.lastSync && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      <span>Last Sync</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {deviceStatus.lastSync}
                    </span>
                  </div>
                )}

                {deviceStatus.error && (
                  <div className="mt-4 rounded-md bg-destructive/10 p-3 text-destructive">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{deviceStatus.error}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={resetDevice}
                disabled={!deviceStatus.connected}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset System
              </Button>
              <Button
                onClick={syncData}
                disabled={!deviceStatus.connected || isSyncing}
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Records
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 