"use client"

import { SelectItem } from "@/components/ui/select"

import { SelectContent } from "@/components/ui/select"

import { SelectValue } from "@/components/ui/select"

import { SelectTrigger } from "@/components/ui/select"

import { Select } from "@/components/ui/select"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalSettings, setGeneralSettings] = useState({
    systemName: "UNILORIN IoT Attendance System",
    adminEmail: "admin@unilorin.edu.ng",
    checkInTime: "08:00",
    checkOutTime: "16:00",
    autoLogout: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setGeneralSettings((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    setGeneralSettings((prev) => ({
      ...prev,
      [id]: checked,
    }))
  }

  const handleSaveSettings = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated successfully.",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your IoT attendance system settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the basic settings for your attendance system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input id="systemName" value={generalSettings.systemName} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" type="email" value={generalSettings.adminEmail} onChange={handleInputChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInTime">Default Check-in Time</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={generalSettings.checkInTime}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkOutTime">Default Check-out Time</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={generalSettings.checkOutTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoLogout">Auto Logout</Label>
                  <p className="text-sm text-muted-foreground">Automatically log out inactive users after 30 minutes</p>
                </div>
                <Switch
                  id="autoLogout"
                  checked={generalSettings.autoLogout}
                  onCheckedChange={(checked) => handleSwitchChange("autoLogout", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={generalSettings.emailNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={generalSettings.smsNotifications}
                  onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                />
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Notification Events</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-login" defaultChecked />
                    <Label htmlFor="notify-login">Failed login attempts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-device" defaultChecked />
                    <Label htmlFor="notify-device">Device offline alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-reports" defaultChecked />
                    <Label htmlFor="notify-reports">Daily attendance reports</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-system" defaultChecked />
                    <Label htmlFor="notify-system">System updates</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Current Password</Label>
                <Input id="password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-medium mb-3">Security Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="two-factor" defaultChecked />
                    <Label htmlFor="two-factor">Enable two-factor authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="ip-restriction" />
                    <Label htmlFor="ip-restriction">Restrict access by IP address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="session-timeout" defaultChecked />
                    <Label htmlFor="session-timeout">Session timeout after inactivity</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage system backups and restore points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Create Backup</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a backup of your entire system including all attendance records and settings
                </p>
                <Button>Create Backup Now</Button>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Automatic Backups</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">System will create backups on a regular schedule</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Restore System</h3>
                <p className="text-sm text-muted-foreground mb-4">Restore your system from a previous backup</p>
                <div className="space-y-2">
                  <Label htmlFor="restore-file">Select Backup File</Label>
                  <Input id="restore-file" type="file" />
                </div>
                <Button className="mt-4" variant="outline">
                  Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

