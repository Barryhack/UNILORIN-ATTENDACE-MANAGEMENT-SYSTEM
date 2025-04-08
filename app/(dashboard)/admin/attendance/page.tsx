"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Download,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function AttendanceRecords() {
  const [date, setDate] = useState<DateRange | undefined>()
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const handleExport = async () => {
    try {
      // Create CSV content
      const headers = ["Name", "Department", "Date", "Time In", "Time Out", "Status"]
      const rows = [
        ["Dr. John Smith", "Computer Science", "2024-02-20", "08:30 AM", "04:45 PM", "Present"]
        // Add more rows from your data
      ]
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n")

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `attendance-records-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Export error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to export records. Please try again."
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Records</h1>
        <p className="text-muted-foreground">View and manage attendance records</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Records</CardTitle>
            <Button 
              variant="outline"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Records
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <Label htmlFor="search" className="sr-only">Search records</Label>
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    name="search"
                    type="search"
                    autoComplete="off"
                    placeholder="Search records..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={departmentFilter} 
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger id="department" className="w-[180px]">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date-range">Date Range</Label>
                <DatePickerWithRange
                  id="date-range"
                  date={date}
                  setDate={setDate}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time In</TableHead>
                  <TableHead>Time Out</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Example row */}
                <TableRow>
                  <TableCell>
                    <div>
                      <p className="font-medium">Dr. John Smith</p>
                      <p className="text-sm text-muted-foreground">Staff</p>
                    </div>
                  </TableCell>
                  <TableCell>Computer Science</TableCell>
                  <TableCell>2024-02-20</TableCell>
                  <TableCell>08:30 AM</TableCell>
                  <TableCell>04:45 PM</TableCell>
                  <TableCell>
                    <Badge variant="default">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Present
                    </Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 