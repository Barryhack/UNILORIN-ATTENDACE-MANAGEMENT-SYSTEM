"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react"

export default function VerifyDevicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<null | "success" | "error">(null)

  // Mock device data based on ID
  const device = {
    id: params.id,
    name: "Main Entrance",
    location: "building-a",
    ipAddress: "192.168.1.100",
    macAddress: "00:1A:2B:3C:4D:5E",
    firmware: "1.0.0",
    status: "online",
    lastSeen: "2 minutes ago",
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    router.push("/dashboard/admin/devices")
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    setVerificationStatus(null)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setVerificationStatus("success")
    setIsVerifying(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Device: {params.id}</h1>
        <p className="text-muted-foreground">Verify and manage device settings</p>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Device Details</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="max-w-2xl">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Device Information</CardTitle>
                <CardDescription>View and update device details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="device-id">Device ID</Label>
                  <Input id="device-id" value={device.id} readOnly />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device-name">Device Name</Label>
                  <Input id="device-name" defaultValue={device.name} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select defaultValue={device.location}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="building-a">Building A</SelectItem>
                      <SelectItem value="building-b">Building B</SelectItem>
                      <SelectItem value="building-c">Building C</SelectItem>
                      <SelectItem value="building-d">Building D</SelectItem>
                      <SelectItem value="exterior">Exterior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ip-address">IP Address</Label>
                  <Input id="ip-address" defaultValue={device.ipAddress} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mac-address">MAC Address</Label>
                  <Input id="mac-address" defaultValue={device.macAddress} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmware">Firmware Version</Label>
                  <Input id="firmware" defaultValue={device.firmware} required />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/devices")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Device"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Device Verification</CardTitle>
              <CardDescription>Verify the device connection and functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Connection Status</h3>
                    <p className="text-sm text-muted-foreground">Check if the device is online and responding</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Last ping: 120ms</p>
                      <p className="text-sm text-muted-foreground">Last checked: {device.lastSeen}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleVerify} disabled={isVerifying}>
                      {isVerifying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Verify Now
                        </>
                      )}
                    </Button>
                  </div>

                  {verificationStatus === "success" && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" />
                        <p className="text-green-800">
                          Verification successful! Device is online and functioning properly.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Hardware Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">CPU Usage</p>
                    <p className="text-2xl font-bold">12%</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Memory Usage</p>
                    <p className="text-2xl font-bold">256MB</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Storage</p>
                    <p className="text-2xl font-bold">1.2GB</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-2xl font-bold">42°C</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push("/dashboard/admin/devices")}>
                Back to Devices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Recent activity from this device</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-12 text-xs text-center text-muted-foreground">
                      {i === 1 ? "10:23 AM" : `${i * 2}:${i * 10} ${i % 2 === 0 ? "PM" : "AM"}`}
                      <div className="text-xs">Today</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {i === 1
                          ? "Device restarted"
                          : i === 2
                            ? "User ID: 1045 checked in"
                            : i === 3
                              ? "Firmware update initiated"
                              : i === 4
                                ? "User ID: 1023 checked in"
                                : "Connection status changed to online"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {i === 1
                          ? "System initiated restart after update"
                          : i === 2
                            ? "Successfully authenticated user"
                            : i === 3
                              ? "Updating from v1.0.0 to v1.1.0"
                              : i === 4
                                ? "Successfully authenticated user"
                                : "Device reconnected to network"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

