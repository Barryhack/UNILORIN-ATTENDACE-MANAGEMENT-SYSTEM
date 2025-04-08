"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  BookOpen, 
  Fingerprint, 
  FileText, 
  Settings,
  Plus,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [deviceStatus, setDeviceStatus] = useState({
    fingerprint: "online",
    rfid: "online",
    sdCard: "online",
    oled: "online"
  })

  // Sample data - replace with actual data from your backend
  const systemStats = {
    totalStudents: 1500,
    totalCourses: 45,
    activeDevices: 3,
    attendanceRecords: 12500
  }

  const recentActivities = [
    {
      id: 1,
      type: "student",
      action: "registered",
      details: "New student registered: John Doe (2023/12345)",
      timestamp: "2024-03-20T10:30:00Z"
    },
    {
      id: 2,
      type: "device",
      action: "connected",
      details: "AMS Device #1 connected successfully",
      timestamp: "2024-03-20T10:25:00Z"
    },
    {
      id: 3,
      type: "course",
      action: "assigned",
      details: "Course CSC 101 assigned to Dr. Smith",
      timestamp: "2024-03-20T10:15:00Z"
    }
  ]

  const handleRefreshDevices = async () => {
    // Implement device status check
    setDeviceStatus(prev => ({
      ...prev,
      fingerprint: "checking",
      rfid: "checking",
      sdCard: "checking",
      oled: "checking"
    }))

    // Simulate API call
    setTimeout(() => {
      setDeviceStatus({
        fingerprint: "online",
        rfid: "online",
        sdCard: "online",
        oled: "online"
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] bg-clip-text text-transparent">
            System Overview
          </h1>
          <p className="text-muted-foreground mt-1">Monitor and manage your attendance system</p>
        </div>
        <Button onClick={handleRefreshDevices} variant="outline" className="rounded-xl">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Status
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="rounded-xl">
          <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
          <TabsTrigger value="devices" className="rounded-lg">Devices</TabsTrigger>
          <TabsTrigger value="activities" className="rounded-lg">Recent Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalStudents}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.totalCourses}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Fingerprint className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.activeDevices}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Activity className="h-3 w-3 text-green-500 mr-1" />
                  All systems operational
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Records</CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemStats.attendanceRecords}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +8% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button variant="outline" className="justify-start rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Register New Student
                </Button>
                <Button variant="outline" className="justify-start rounded-xl">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Course
                </Button>
                <Button variant="outline" className="justify-start rounded-xl">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure Device
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">Fingerprint Scanner</span>
                  <Badge variant={deviceStatus.fingerprint === "online" ? "default" : "destructive"} className="rounded-lg">
                    {deviceStatus.fingerprint}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">RFID Reader</span>
                  <Badge variant={deviceStatus.rfid === "online" ? "default" : "destructive"} className="rounded-lg">
                    {deviceStatus.rfid}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">SD Card</span>
                  <Badge variant={deviceStatus.sdCard === "online" ? "default" : "destructive"} className="rounded-lg">
                    {deviceStatus.sdCard}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">OLED Display</span>
                  <Badge variant={deviceStatus.oled === "online" ? "default" : "destructive"} className="rounded-lg">
                    {deviceStatus.oled}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Device Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="rounded-xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Device Status</AlertTitle>
                <AlertDescription>
                  All AMS devices are currently operational and connected to the system.
                </AlertDescription>
              </Alert>
              <div className="mt-4 space-y-4">
                {[1, 2, 3].map((device) => (
                  <div key={device} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <h3 className="font-medium">AMS Device #{device}</h3>
                      <p className="text-sm text-muted-foreground">IP: 192.168.1.{99 + device}</p>
                    </div>
                    <Button variant="outline" className="rounded-xl">Configure</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg bg-muted/50">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.details}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="default" className="rounded-lg">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 