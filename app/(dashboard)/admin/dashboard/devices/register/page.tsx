"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function RegisterDevicePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    deviceId: "",
    deviceName: "",
    location: "",
    ipAddress: "",
    macAddress: "",
    firmware: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
    // Clear error when user types
    if (error) setError("")
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: value,
    }))
    // Clear error when user selects
    if (error) setError("")
  }

  const validateMacAddress = (mac: string) => {
    // Basic MAC address validation (XX:XX:XX:XX:XX:XX format)
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
    return macRegex.test(mac)
  }

  const validateIpAddress = (ip: string) => {
    // Basic IPv4 validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/
    return ipRegex.test(ip)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate all fields are filled
    const { deviceId, deviceName, location, ipAddress, macAddress, firmware } = formData
    if (!deviceId || !deviceName || !location || !ipAddress || !macAddress || !firmware) {
      setError("Please fill in all fields")
      return
    }

    // Validate MAC address format
    if (!validateMacAddress(macAddress)) {
      setError("Please enter a valid MAC address (format: XX:XX:XX:XX:XX:XX)")
      return
    }

    // Validate IP address format
    if (!validateIpAddress(ipAddress)) {
      setError("Please enter a valid IP address (format: XXX.XXX.XXX.XXX)")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Device Registered",
        description: `Device ${deviceId} has been successfully registered.`,
      })

      router.push("/dashboard/admin/devices")
    } catch (err) {
      setError("An error occurred while registering the device. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Register New Device</h1>
        <p className="text-muted-foreground">Add a new IoT attendance device to your system</p>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>Enter the details of the new device you want to register</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Input
                id="deviceId"
                value={formData.deviceId}
                onChange={handleChange}
                placeholder="Enter device ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                value={formData.deviceName}
                onChange={handleChange}
                placeholder="Enter a descriptive name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={handleSelectChange} required>
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
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input
                id="ipAddress"
                value={formData.ipAddress}
                onChange={handleChange}
                placeholder="192.168.1.100"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input
                id="macAddress"
                value={formData.macAddress}
                onChange={handleChange}
                placeholder="00:1A:2B:3C:4D:5E"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firmware">Firmware Version</Label>
              <Input id="firmware" value={formData.firmware} onChange={handleChange} placeholder="1.0.0" required />
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
                  Registering...
                </>
              ) : (
                "Register Device"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

