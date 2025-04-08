"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Download, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

// Mock data for attendance records
const allAttendanceRecords = [
  {
    id: "1",
    userId: "1001",
    userName: "John Doe",
    deviceId: "D-1",
    deviceName: "Main Entrance",
    time: "08:30 AM",
    date: "2023-03-12",
    status: "Check In",
  },
  {
    id: "2",
    userId: "1002",
    userName: "Jane Smith",
    deviceId: "D-2",
    deviceName: "Side Entrance",
    time: "08:45 AM",
    date: "2023-03-12",
    status: "Check In",
  },
  {
    id: "3",
    userId: "1004",
    userName: "Alice Brown",
    deviceId: "D-1",
    deviceName: "Main Entrance",
    time: "09:00 AM",
    date: "2023-03-12",
    status: "Check In",
  },
  {
    id: "4",
    userId: "1005",
    userName: "Charlie Davis",
    deviceId: "D-4",
    deviceName: "Conference Room",
    time: "09:15 AM",
    date: "2023-03-12",
    status: "Check In",
  },
  {
    id: "5",
    userId: "1001",
    userName: "John Doe",
    deviceId: "D-1",
    deviceName: "Main Entrance",
    time: "05:30 PM",
    date: "2023-03-12",
    status: "Check Out",
  },
  {
    id: "6",
    userId: "1002",
    userName: "Jane Smith",
    deviceId: "D-2",
    deviceName: "Side Entrance",
    time: "05:45 PM",
    date: "2023-03-12",
    status: "Check Out",
  },
  {
    id: "7",
    userId: "1004",
    userName: "Alice Brown",
    deviceId: "D-1",
    deviceName: "Main Entrance",
    time: "06:00 PM",
    date: "2023-03-12",
    status: "Check Out",
  },
  {
    id: "8",
    userId: "1005",
    userName: "Charlie Davis",
    deviceId: "D-4",
    deviceName: "Conference Room",
    time: "06:15 PM",
    date: "2023-03-12",
    status: "Check Out",
  },
  {
    id: "9",
    userId: "1010",
    userName: "Ivy Martin",
    deviceId: "D-5",
    deviceName: "Lab Entrance",
    time: "08:30 AM",
    date: "2023-03-12",
    status: "Check In",
  },
  {
    id: "10",
    userId: "1010",
    userName: "Ivy Martin",
    deviceId: "D-5",
    deviceName: "Lab Entrance",
    time: "05:30 PM",
    date: "2023-03-12",
    status: "Check Out",
  },
  {
    id: "11",
    userId: "1003",
    userName: "Bob Johnson",
    deviceId: "D-3",
    deviceName: "Back Door",
    time: "09:30 AM",
    date: "2023-03-13",
    status: "Check In",
  },
  {
    id: "12",
    userId: "1003",
    userName: "Bob Johnson",
    deviceId: "D-3",
    deviceName: "Back Door",
    time: "04:45 PM",
    date: "2023-03-13",
    status: "Check Out",
  },
]

export default function AttendancePage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState("2023-03-12")
  const [statusFilter, setStatusFilter] = useState("all")
  const [attendanceRecords, setAttendanceRecords] = useState(allAttendanceRecords)

  // Filter records based on search, date and status
  const filterRecords = () => {
    let filtered = allAttendanceRecords

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((record) => record.date === selectedDate)
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((record) =>
        statusFilter === "check-in" ? record.status === "Check In" : record.status === "Check Out",
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (record) =>
          record.userName.toLowerCase().includes(query) ||
          record.userId.toLowerCase().includes(query) ||
          record.deviceName.toLowerCase().includes(query),
      )
    }

    setAttendanceRecords(filtered)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    filterRecords()
  }

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    filterRecords()
  }

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    filterRecords()
  }

  // Handle export data
  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your attendance data is being exported to CSV.",
    })

    // In a real app, this would trigger a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your attendance data has been exported successfully.",
      })
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Records</h1>
          <p className="text-muted-foreground">View and manage attendance records from your IoT devices</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
          <CardDescription>View attendance records for all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or ID..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input type="date" value={selectedDate} onChange={handleDateChange} className="w-auto" />
              </div>

              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="check-in">Check In</SelectItem>
                  <SelectItem value="check-out">Check Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.length > 0 ? (
                  attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>
                        <div>
                          <p>{record.userName}</p>
                          <p className="text-xs text-muted-foreground">ID: {record.userId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{record.deviceName}</p>
                          <p className="text-xs text-muted-foreground">ID: {record.deviceId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.time}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            record.status === "Check In" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

