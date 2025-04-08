"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Save, 
  Clock, 
  Wifi, 
  Fingerprint, 
  CreditCard, 
  HardDrive, 
  RefreshCw, 
  Bell, 
  Shield, 
  Settings as SettingsIcon, 
  CheckCircle, 
  XCircle,
  AlertTriangle
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SystemSettings {
  workingHours: {
    start: string
    end: string
  }
  gracePeriod: number
  autoSync: boolean
  syncInterval: number
  notifyLateAttendance: boolean
  notifyAbsence: boolean
  hardware: {
    esp32: {
      ipAddress: string
      port: number
      connected: boolean
      lastSync: string
    }
    fingerprint: {
      enabled: boolean
      timeout: number
      quality: number
      maxAttempts: number
    }
    rfid: {
      enabled: boolean
      timeout: number
    }
    sdCard: {
      enabled: boolean
      backupInterval: number
    }
  }
  security: {
    requirePassword: boolean
    sessionTimeout: number
    maxLoginAttempts: number
  }
}

export default function Settings() {
  const [settings, setSettings] = useState<SystemSettings>({
    workingHours: {
      start: "08:00",
      end: "17:00"
    },
    gracePeriod: 15,
    autoSync: true,
    syncInterval: 30,
    notifyLateAttendance: true,
    notifyAbsence: true,
    hardware: {
      esp32: {
        ipAddress: "192.168.1.100",
        port: 80,
        connected: false,
        lastSync: "Never"
      },
      fingerprint: {
        enabled: true,
        timeout: 10,
        quality: 60,
        maxAttempts: 3
      },
      rfid: {
        enabled: true,
        timeout: 5
      },
      sdCard: {
        enabled: true,
        backupInterval: 60
      }
    },
    security: {
      requirePassword: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [hardwareStatus, setHardwareStatus] = useState({
    esp32: "disconnected",
    fingerprint: "disconnected",
    rfid: "disconnected",
    sdCard: "disconnected"
  })

  // Simulate checking hardware status
  useEffect(() => {
    const checkHardwareStatus = async () => {
      try {
        // In a real implementation, this would be an API call to the ESP32
        // For now, we'll simulate the response
        const response = await fetch(`http://${settings.hardware.esp32.ipAddress}:${settings.hardware.esp32.port}/status`)
          .catch(() => ({ ok: false }))
        
        if (response.ok) {
          setHardwareStatus({
            esp32: "connected",
            fingerprint: "connected",
            rfid: "connected",
            sdCard: "connected"
          })
          setSettings(prev => ({
            ...prev,
            hardware: {
              ...prev.hardware,
              esp32: {
                ...prev.hardware.esp32,
                connected: true,
                lastSync: new Date().toLocaleString()
              }
            }
          }))
        } else {
          setHardwareStatus({
            esp32: "disconnected",
            fingerprint: "disconnected",
            rfid: "disconnected",
            sdCard: "disconnected"
          })
          setSettings(prev => ({
            ...prev,
            hardware: {
              ...prev.hardware,
              esp32: {
                ...prev.hardware.esp32,
                connected: false
              }
            }
          }))
        }
      } catch (error) {
        console.error("Error checking hardware status:", error)
      }
    }

    checkHardwareStatus()
    const interval = setInterval(checkHardwareStatus, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [settings.hardware.esp32.ipAddress, settings.hardware.esp32.port])

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      // Save settings to backend
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      toast.success("Settings saved successfully")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  const testHardwareConnection = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call to test the connection
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      toast.success("Hardware connection test successful")
    } catch (error) {
      console.error("Error testing hardware connection:", error)
      toast.error("Hardware connection test failed")
    } finally {
      setIsLoading(false)
    }
  }

  const syncHardware = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would be an API call to sync with the hardware
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      
      setSettings(prev => ({
        ...prev,
        hardware: {
          ...prev.hardware,
          esp32: {
            ...prev.hardware.esp32,
            lastSync: new Date().toLocaleString()
          }
        }
      }))
      
      toast.success("Hardware synchronized successfully")
    } catch (error) {
      console.error("Error synchronizing hardware:", error)
      toast.error("Failed to synchronize hardware")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] bg-clip-text text-transparent">
          System Settings
        </h1>
        <p className="text-muted-foreground">Configure attendance system settings and hardware</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="hardware" className="flex items-center gap-2">
            <HardDrive className="h-4 w-4" />
            Hardware
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>Set the default working hours for attendance tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      className="rounded-xl"
                      value={settings.workingHours.start}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: {
                          ...prev.workingHours,
                          start: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      className="rounded-xl"
                      value={settings.workingHours.end}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        workingHours: {
                          ...prev.workingHours,
                          end: e.target.value
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Grace Period (minutes)</Label>
                  <Select
                    value={settings.gracePeriod.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      gracePeriod: parseInt(value)
                    }))}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 15, 20, 30].map(minutes => (
                        <SelectItem
                          key={minutes}
                          value={minutes.toString()}
                        >
                          {minutes} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Synchronization</CardTitle>
              <CardDescription>Configure data synchronization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSync">Auto Sync</Label>
                  <Switch
                    id="autoSync"
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      autoSync: checked
                    }))}
                  />
                </div>

                {settings.autoSync && (
                  <div className="space-y-2">
                    <Label>Sync Interval</Label>
                    <Select
                      value={settings.syncInterval.toString()}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        syncInterval: parseInt(value)
                      }))}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 60].map(minutes => (
                          <SelectItem
                            key={minutes}
                            value={minutes.toString()}
                          >
                            {minutes} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardware" className="space-y-6">
          <Alert variant="default" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Hardware Status</AlertTitle>
            <AlertDescription>
              {settings.hardware.esp32.connected 
                ? "All hardware components are connected and functioning properly." 
                : "Some hardware components are disconnected. Please check your connections."}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 border rounded-xl">
              <div className={`p-2 rounded-full ${hardwareStatus.esp32 === "connected" ? "bg-green-100" : "bg-red-100"}`}>
                <Wifi className={`h-5 w-5 ${hardwareStatus.esp32 === "connected" ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="font-medium">ESP32 Controller</p>
                <p className="text-sm text-muted-foreground">
                  {hardwareStatus.esp32 === "connected" ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-xl">
              <div className={`p-2 rounded-full ${hardwareStatus.fingerprint === "connected" ? "bg-green-100" : "bg-red-100"}`}>
                <Fingerprint className={`h-5 w-5 ${hardwareStatus.fingerprint === "connected" ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="font-medium">Fingerprint Scanner</p>
                <p className="text-sm text-muted-foreground">
                  {hardwareStatus.fingerprint === "connected" ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-xl">
              <div className={`p-2 rounded-full ${hardwareStatus.rfid === "connected" ? "bg-green-100" : "bg-red-100"}`}>
                <CreditCard className={`h-5 w-5 ${hardwareStatus.rfid === "connected" ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="font-medium">RFID Reader</p>
                <p className="text-sm text-muted-foreground">
                  {hardwareStatus.rfid === "connected" ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-xl">
              <div className={`p-2 rounded-full ${hardwareStatus.sdCard === "connected" ? "bg-green-100" : "bg-red-100"}`}>
                <HardDrive className={`h-5 w-5 ${hardwareStatus.sdCard === "connected" ? "text-green-600" : "text-red-600"}`} />
              </div>
              <div>
                <p className="font-medium">SD Card Module</p>
                <p className="text-sm text-muted-foreground">
                  {hardwareStatus.sdCard === "connected" ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>

          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>ESP32 Configuration</CardTitle>
              <CardDescription>Configure the ESP32 microcontroller connection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ipAddress">IP Address</Label>
                    <Input
                      id="ipAddress"
                      className="rounded-xl"
                      value={settings.hardware.esp32.ipAddress}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hardware: {
                          ...prev.hardware,
                          esp32: {
                            ...prev.hardware.esp32,
                            ipAddress: e.target.value
                          }
                        }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      type="number"
                      className="rounded-xl"
                      value={settings.hardware.esp32.port}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hardware: {
                          ...prev.hardware,
                          esp32: {
                            ...prev.hardware.esp32,
                            port: parseInt(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Last Synchronized</p>
                    <p className="text-sm text-muted-foreground">{settings.hardware.esp32.lastSync}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="rounded-xl"
                      onClick={testHardwareConnection}
                      disabled={isLoading}
                    >
                      Test Connection
                    </Button>
                    <Button 
                      className="rounded-xl bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] text-white hover:opacity-90"
                      onClick={syncHardware}
                      disabled={isLoading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Fingerprint Scanner</CardTitle>
              <CardDescription>Configure the fingerprint scanner settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fingerprintEnabled">Enable Fingerprint Scanner</Label>
                  <Switch
                    id="fingerprintEnabled"
                    checked={settings.hardware.fingerprint.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      hardware: {
                        ...prev.hardware,
                        fingerprint: {
                          ...prev.hardware.fingerprint,
                          enabled: checked
                        }
                      }
                    }))}
                  />
                </div>

                {settings.hardware.fingerprint.enabled && (
                  <>
                    <div className="space-y-2">
                      <Label>Scan Timeout (seconds)</Label>
                      <Select
                        value={settings.hardware.fingerprint.timeout.toString()}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          hardware: {
                            ...prev.hardware,
                            fingerprint: {
                              ...prev.hardware.fingerprint,
                              timeout: parseInt(value)
                            }
                          }
                        }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 15, 20, 30].map(seconds => (
                            <SelectItem
                              key={seconds}
                              value={seconds.toString()}
                            >
                              {seconds} seconds
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Scan Quality Threshold (%)</Label>
                      <Select
                        value={settings.hardware.fingerprint.quality.toString()}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          hardware: {
                            ...prev.hardware,
                            fingerprint: {
                              ...prev.hardware.fingerprint,
                              quality: parseInt(value)
                            }
                          }
                        }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[40, 50, 60, 70, 80].map(quality => (
                            <SelectItem
                              key={quality}
                              value={quality.toString()}
                            >
                              {quality}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Maximum Scan Attempts</Label>
                      <Select
                        value={settings.hardware.fingerprint.maxAttempts.toString()}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          hardware: {
                            ...prev.hardware,
                            fingerprint: {
                              ...prev.hardware.fingerprint,
                              maxAttempts: parseInt(value)
                            }
                          }
                        }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(attempts => (
                            <SelectItem
                              key={attempts}
                              value={attempts.toString()}
                            >
                              {attempts} attempts
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>RFID Reader</CardTitle>
              <CardDescription>Configure the RFID reader settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rfidEnabled">Enable RFID Reader</Label>
                  <Switch
                    id="rfidEnabled"
                    checked={settings.hardware.rfid.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      hardware: {
                        ...prev.hardware,
                        rfid: {
                          ...prev.hardware.rfid,
                          enabled: checked
                        }
                      }
                    }))}
                  />
                </div>

                {settings.hardware.rfid.enabled && (
                  <div className="space-y-2">
                    <Label>Scan Timeout (seconds)</Label>
                    <Select
                      value={settings.hardware.rfid.timeout.toString()}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        hardware: {
                          ...prev.hardware,
                          rfid: {
                            ...prev.hardware.rfid,
                            timeout: parseInt(value)
                          }
                        }
                      }))}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 5, 10, 15].map(seconds => (
                          <SelectItem
                            key={seconds}
                            value={seconds.toString()}
                          >
                            {seconds} seconds
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>SD Card Module</CardTitle>
              <CardDescription>Configure the SD card module settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sdCardEnabled">Enable SD Card Storage</Label>
                  <Switch
                    id="sdCardEnabled"
                    checked={settings.hardware.sdCard.enabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      hardware: {
                        ...prev.hardware,
                        sdCard: {
                          ...prev.hardware.sdCard,
                          enabled: checked
                        }
                      }
                    }))}
                  />
                </div>

                {settings.hardware.sdCard.enabled && (
                  <div className="space-y-2">
                    <Label>Backup Interval (minutes)</Label>
                    <Select
                      value={settings.hardware.sdCard.backupInterval.toString()}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        hardware: {
                          ...prev.hardware,
                          sdCard: {
                            ...prev.hardware.sdCard,
                            backupInterval: parseInt(value)
                          }
                        }
                      }))}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[15, 30, 60, 120].map(minutes => (
                          <SelectItem
                            key={minutes}
                            value={minutes.toString()}
                          >
                            {minutes} minutes
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifyLate">Notify Late Attendance</Label>
                  <Switch
                    id="notifyLate"
                    checked={settings.notifyLateAttendance}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifyLateAttendance: checked
                    }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifyAbsence">Notify Absence</Label>
                  <Switch
                    id="notifyAbsence"
                    checked={settings.notifyAbsence}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      notifyAbsence: checked
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure system security parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="requirePassword">Require Password for Hardware Operations</Label>
                  <Switch
                    id="requirePassword"
                    checked={settings.security.requirePassword}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        requirePassword: checked
                      }
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select
                    value={settings.security.sessionTimeout.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        sessionTimeout: parseInt(value)
                      }
                    }))}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[15, 30, 60, 120].map(minutes => (
                        <SelectItem
                          key={minutes}
                          value={minutes.toString()}
                        >
                          {minutes} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Maximum Login Attempts</Label>
                  <Select
                    value={settings.security.maxLoginAttempts.toString()}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        maxLoginAttempts: parseInt(value)
                      }
                    }))}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[3, 5, 10].map(attempts => (
                        <SelectItem
                          key={attempts}
                          value={attempts.toString()}
                        >
                          {attempts} attempts
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={saveSettings}
          className="rounded-xl bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] text-white hover:opacity-90"
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
} 