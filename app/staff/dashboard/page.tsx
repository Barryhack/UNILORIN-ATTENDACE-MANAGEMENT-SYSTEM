"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Users, BookOpen, Clock, ChevronRight, CheckCircle, AlertCircle, UserCircle, LayoutDashboard, GraduationCap, CalendarDays, Settings, LogOut, FileText, Table, History, MessageSquare, Plus, MoreVertical } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

export default function StaffDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("attendance")
  const [isExporting, setIsExporting] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [isTakingAttendance, setIsTakingAttendance] = useState(false)
  const [attendanceDate, setAttendanceDate] = useState("")
  const [currentAttendanceMode, setCurrentAttendanceMode] = useState<"default" | "rfid">("default")
  const [attendanceStats, setAttendanceStats] = useState({
    totalSessions: 24,
    thisWeek: 5,
    averageAttendance: 87
  })
  const [students, setStudents] = useState([
    { id: "ST001", name: "John Doe", regNo: "20/1234", present: false },
    { id: "ST002", name: "Jane Smith", regNo: "20/1235", present: false },
    { id: "ST003", name: "Mike Johnson", regNo: "20/1236", present: false },
    { id: "ST004", name: "Alex Williams", regNo: "20/1237", present: false },
    { id: "ST005", name: "Sarah Brown", regNo: "20/1238", present: false },
    { id: "ST006", name: "Robert Clark", regNo: "20/1239", present: false },
    { id: "ST007", name: "Emily Davis", regNo: "20/1240", present: false },
    { id: "ST008", name: "Michael Wilson", regNo: "20/1241", present: false }
  ])

  // Updated attendance data structure with student details
  const attendanceData = [
    {
      course: "CSC 401",
      date: "2024-03-20",
      time: "2:00 PM",
      present: 42,
      total: 45,
      percentage: 93,
      students: [
        { id: "ST001", name: "John Doe", regNo: "20/1234", status: "present", timestamp: "2024-03-20T14:05:23" },
        { id: "ST002", name: "Jane Smith", regNo: "20/1235", status: "present", timestamp: "2024-03-20T14:06:45" },
        { id: "ST003", name: "Mike Johnson", regNo: "20/1236", status: "absent", timestamp: null },
        // ... more students
      ]
    },
    {
      course: "CSC 405",
      date: "2024-03-19",
      time: "10:00 AM",
      present: 36,
      total: 38,
      percentage: 95,
      students: [
        { id: "ST001", name: "John Doe", regNo: "20/1234", status: "present", timestamp: "2024-03-19T10:02:15" },
        { id: "ST002", name: "Jane Smith", regNo: "20/1235", status: "present", timestamp: "2024-03-19T10:01:30" },
        { id: "ST003", name: "Mike Johnson", regNo: "20/1236", status: "present", timestamp: "2024-03-19T10:03:45" },
        // ... more students
      ]
    },
    // ... more sessions
  ]

  // Available courses for filtering
  const courses = [
    { code: "CSC 401", name: "Computer Architecture" },
    { code: "CSC 405", name: "Operating Systems" },
    { code: "CSC 409", name: "Advanced Programming" }
  ]

  // Filter attendance data based on selected course
  const filteredAttendanceData = selectedCourse === "all" 
    ? attendanceData 
    : attendanceData.filter(record => record.course === selectedCourse)

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      
      const title = selectedCourse === "all" 
        ? "All Courses Attendance Report" 
        : `${selectedCourse} Attendance Report`
      
      // Create HTML content with letterhead and simplified student information
      const tableHtml = `
        <div style="margin-bottom: 20px; text-align: center;">
          <img src="/unilorin-logo.png" alt="University of Ilorin Logo" style="height: 80px; margin-bottom: 10px;" />
          <h2 style="color: #1a365d; margin: 0; font-size: 24px;">University of Ilorin</h2>
          <p style="color: #4a5568; margin: 5px 0; font-size: 16px;">Faculty of Computing</p>
          <p style="color: #4a5568; margin: 5px 0; font-size: 16px;">Department of Computer Science</p>
          <hr style="border: 1px solid #e2e8f0; margin: 20px 0;" />
        </div>
        <div style="margin-bottom: 20px;">
          <h1 style="color: #2d3748; text-align: center; margin-bottom: 10px;">${title}</h1>
          <p style="color: #4a5568; text-align: center; margin: 0;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
        <table style="width:100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="border: 1px solid #ddd; padding: 8px;">S/N</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Name</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Matric Number</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${filteredAttendanceData.flatMap((session, sessionIndex) => 
              session.students.map((student, studentIndex) => {
                const serialNumber = sessionIndex * 100 + studentIndex + 1;
                return `
                  <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${serialNumber}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${student.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${student.regNo}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${student.status}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${student.timestamp || 'N/A'}</td>
                  </tr>
                `;
              })
            ).join('')}
          </tbody>
        </table>
        <div style="margin-top: 40px; text-align: right;">
          <div style="border-top: 1px solid #000; width: 200px; margin-left: auto; padding-top: 10px;">
            <p style="margin: 0;">Lecturer's Signature</p>
          </div>
        </div>
      `
      
      // Create a new window with the table
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                @page {
                  size: A4;
                  margin: 20mm;
                }
                body { 
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                }
                @media print {
                  body { padding: 0; }
                  table { page-break-inside: auto; }
                  tr { page-break-inside: avoid; page-break-after: auto; }
                  .page-break { page-break-before: always; }
                }
              </style>
            </head>
            <body>
              ${tableHtml}
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() {
                    window.close();
                  }
                }
              </script>
            </body>
          </html>
        `)
        printWindow.document.close()
      }
      
      toast.success('PDF generated successfully')
    } catch (error) {
      toast.error('Failed to generate PDF')
      console.error('Export PDF error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportExcel = async () => {
    try {
      setIsExporting(true)
      
      const filename = selectedCourse === "all" 
        ? `all-courses-attendance-${new Date().toISOString().split('T')[0]}.csv` 
        : `${selectedCourse.replace(' ', '-')}-attendance-${new Date().toISOString().split('T')[0]}.csv`
      
      // Create CSV content with simplified student information
      const headers = [
        'S/N',
        'Name',
        'Matric Number',
        'Status',
        'Timestamp'
      ]
      
      // Generate CSV content with serial numbers
      let serialNumber = 1;
      const csvContent = [
        headers.join(','),
        ...filteredAttendanceData.flatMap(session => 
          session.students.map(student => {
            const row = [
              serialNumber++,
              student.name,
              student.regNo,
              student.status,
              student.timestamp || 'N/A'
            ].join(',');
            return row;
          })
        )
      ].join('\n')
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      toast.success('CSV exported successfully')
    } catch (error) {
      toast.error('Failed to export CSV')
      console.error('Export CSV error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleStartAttendance = async () => {
    if (!selectedCourse || !attendanceDate) {
      toast.error("Please select a course and date")
      return
    }

    try {
      // Send command to ESP32 to start attendance mode
      const response = await fetch('http://esp32-ip/start-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: selectedCourse,
          date: attendanceDate,
          mode: currentAttendanceMode
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start attendance system');
      }

      // Show status on the dashboard
      toast.info("Attendance system activated. Waiting for student verification...");

      // Start listening for attendance events
      const eventSource = new EventSource('http://esp32-ip/attendance-events');
      
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'fingerprint_success':
            toast.success(`Attendance recorded for ${data.studentName}`);
            break;
          case 'fingerprint_failed':
            toast.warning("Fingerprint not recognized. Please try again.");
            break;
          case 'rfid_required':
            toast.info("Please scan your RFID card");
            break;
          case 'rfid_success':
            toast.success(`Attendance recorded via RFID for ${data.studentName}`);
            break;
          case 'rfid_failed':
            toast.error("RFID not recognized. Please contact admin.");
            break;
          case 'error':
            toast.error(data.message);
            break;
        }
      };

      eventSource.onerror = () => {
        toast.error("Connection to attendance system lost");
        eventSource.close();
      };

      // Store the event source for cleanup
      setIsTakingAttendance(true);
      
    } catch (error) {
      console.error('Error starting attendance:', error);
      toast.error("Failed to start attendance system. Please check hardware connection.");
    }
  }

  const handleSubmitAttendance = async () => {
    try {
      // Send command to ESP32 to stop attendance mode
      const response = await fetch('http://esp32-ip/stop-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to stop attendance system');
      }

      // Get the attendance data from ESP32
      const attendanceResponse = await fetch('http://esp32-ip/get-attendance');
      const attendanceData = await attendanceResponse.json();

      // Process the attendance data
      const newAttendance = {
        course: selectedCourse,
        date: attendanceDate,
        time: new Date().toLocaleTimeString(),
        present: attendanceData.present,
        total: attendanceData.total,
        percentage: Math.round((attendanceData.present / attendanceData.total) * 100),
        students: attendanceData.students.map(student => ({
          id: student.id,
          name: student.name,
          regNo: student.regNo,
          status: student.status,
          timestamp: student.timestamp
        }))
      };

      // Add to attendance data
      attendanceData.unshift(newAttendance);
      
      // Reset form
      setSelectedCourse("");
      setAttendanceDate("");
      setIsTakingAttendance(false);
      
      toast.success("Attendance session completed successfully");
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error("Failed to complete attendance session");
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-gray-900">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-16 hover:w-64 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-800 border-r border-blue-700/30 shadow-xl transition-all duration-300 ease-in-out z-20 group rounded-r-2xl">
        <div className="flex flex-col h-full items-center group-hover:items-start">
          {/* Logo */}
          <div className="w-full p-4 flex justify-center group-hover:justify-start items-center border-b border-blue-500/20">
            <img 
              src="/unilorin-logo.png" 
              alt="University of Ilorin Logo" 
              className="w-12 h-12 object-contain rounded-lg"
            />
            <span className="ml-3 text-white font-bold text-lg hidden group-hover:block">AMS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 w-full py-6 flex flex-col items-center group-hover:items-start space-y-6">
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:w-full group-hover:justify-start group-hover:px-4 ${
                activeTab === "overview" ? "bg-blue-700" : "hover:bg-blue-500/30"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <LayoutDashboard className="h-5 w-5 text-white" />
              <span className="ml-3 text-white hidden group-hover:block">Overview</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:w-full group-hover:justify-start group-hover:px-4 ${
                activeTab === "courses" ? "bg-blue-700" : "hover:bg-blue-500/30"
              }`}
              onClick={() => setActiveTab("courses")}
            >
              <GraduationCap className="h-5 w-5 text-white" />
              <span className="ml-3 text-white hidden group-hover:block">Courses</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:w-full group-hover:justify-start group-hover:px-4 ${
                activeTab === "attendance" ? "bg-blue-700" : "hover:bg-blue-500/30"
              }`}
              onClick={() => setActiveTab("attendance")}
            >
              <CalendarDays className="h-5 w-5 text-white" />
              <span className="ml-3 text-white hidden group-hover:block">Attendance</span>
            </Button>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 w-full flex justify-center group-hover:justify-start">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:w-full group-hover:justify-start group-hover:px-4 hover:bg-blue-500/30"
              onClick={() => {
                // Add logout functionality here
                window.location.href = '/auth/login';
              }}
            >
              <LogOut className="h-5 w-5 text-white" />
              <span className="ml-3 text-white hidden group-hover:block">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-16">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 rounded-b-2xl">
          <div className="px-6 py-4">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-400">Welcome back, Professor</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Button variant="outline" size="icon" className="relative group rounded-xl">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                      3
                    </span>
                    <div className="absolute -right-2 -top-2 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </Button>
                  {/* Notification Dropdown */}
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block">
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
                      <div className="space-y-2">
                        {[1, 2, 3].map((_, i) => (
                          <div key={i} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                            <p className="text-sm text-gray-900 dark:text-white">New attendance record submitted</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 group">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200">
                    SP
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Staff Profile</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View profile</p>
                  </div>
                  {/* Profile Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hidden group-hover:block">
                    <div className="p-2">
                      <div className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                        View Profile
                      </div>
                      <div className="px-2 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl cursor-pointer">
                        Settings
                      </div>
                      <div className="px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl cursor-pointer">
                        Logout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 group rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Sessions</CardTitle>
                    <CalendarDays className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{attendanceStats.totalSessions}</p>
                    <p className="ml-2 text-sm text-blue-500">Total</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <Progress value={80} className="h-1 rounded-full" />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{attendanceStats.thisWeek} sessions this week</p>
                      <p className="text-xs font-medium text-blue-500">+3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 group rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Attendance</CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{attendanceStats.averageAttendance}%</p>
                    <p className="ml-2 text-sm text-green-500">Rate</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <Progress value={attendanceStats.averageAttendance} className="h-1 rounded-full" />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Overall attendance rate</p>
                      <p className="text-xs font-medium text-green-500">+2% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 group rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Session</CardTitle>
                    <Clock className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">2:00 PM</p>
                    <p className="ml-2 text-sm text-orange-500">CSC 401</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <Progress value={25} className="h-1 rounded-full" />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Starts in 2 hours</p>
                      <p className="text-xs font-medium text-orange-500">25%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Today's Schedule</CardTitle>
                          <CardDescription>Your upcoming classes for today</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2 rounded-xl"
                          onClick={() => {
                            // Add calendar view functionality
                            console.log("View all schedule");
                          }}
                        >
                          <CalendarDays className="h-4 w-4" />
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-2xl border"
                      />
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">CSC 401 - Computer Architecture</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">2:00 PM - 4:00 PM</p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 rounded-xl"
                            onClick={() => {
                              // Add view details functionality
                              console.log("View class details");
                            }}
                          >
                            View Details
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Recent Activities</CardTitle>
                          <CardDescription>Latest updates from your classes</CardDescription>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2 rounded-xl"
                          onClick={() => {
                            // Add view all activities functionality
                            console.log("View all activities");
                          }}
                        >
                          <History className="h-4 w-4" />
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { 
                            title: "CSC 401 Attendance", 
                            time: "2 hours ago", 
                            type: "attendance", 
                            status: "completed",
                            icon: <CheckCircle className="h-5 w-5 text-green-500" />
                          },
                          { 
                            title: "New Course Material", 
                            time: "5 hours ago", 
                            type: "material", 
                            status: "pending",
                            icon: <BookOpen className="h-5 w-5 text-blue-500" />
                          },
                          { 
                            title: "Student Query", 
                            time: "1 day ago", 
                            type: "query", 
                            status: "completed",
                            icon: <MessageSquare className="h-5 w-5 text-purple-500" />
                          }
                        ].map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                {activity.icon}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-xl ${
                                activity.status === "completed" 
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                                  : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                              }`}>
                                {activity.status}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-xl"
                                onClick={() => {
                                  // Add view activity details functionality
                                  console.log("View activity details");
                                }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Your Courses</CardTitle>
                        <CardDescription>Manage your current courses and materials</CardDescription>
                      </div>
                      <Button 
                        className="flex items-center gap-2 rounded-xl"
                        onClick={() => {
                          // Add new course functionality
                          console.log("Add new course");
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add Course
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { 
                          code: "CSC 401", 
                          name: "Computer Architecture", 
                          students: 45, 
                          progress: 75, 
                          nextClass: "Today, 2:00 PM",
                          color: "from-blue-500 to-blue-600"
                        },
                        { 
                          code: "CSC 405", 
                          name: "Operating Systems", 
                          students: 38, 
                          progress: 60, 
                          nextClass: "Tomorrow, 10:00 AM",
                          color: "from-purple-500 to-purple-600"
                        },
                        { 
                          code: "CSC 409", 
                          name: "Advanced Programming", 
                          students: 42, 
                          progress: 80, 
                          nextClass: "Friday, 1:00 PM",
                          color: "from-green-500 to-green-600"
                        }
                      ].map((course, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <Card className="hover:shadow-lg transition-all duration-200 group rounded-2xl">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                                  <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-xl"
                                    onClick={() => {
                                      // Add course settings functionality
                                      console.log("Course settings");
                                    }}
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8 rounded-xl"
                                    onClick={() => {
                                      // Add more options functionality
                                      console.log("More options");
                                    }}
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold text-gray-900 dark:text-white">{course.code}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{course.name}</p>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-500 dark:text-gray-400">{course.students} Students</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-500 dark:text-gray-400">{course.nextClass}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Course Progress</span>
                                    <span className="font-medium text-blue-500">{course.progress}%</span>
                                  </div>
                                  <Progress value={course.progress} className="h-1 rounded-full" />
                                </div>
                                <div className="flex justify-between">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center gap-2 rounded-xl"
                                    onClick={() => {
                                      // Add view materials functionality
                                      console.log("View course materials");
                                    }}
                                  >
                                    <BookOpen className="h-4 w-4" />
                                    Materials
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center gap-2 rounded-xl"
                                    onClick={() => {
                                      // Add view students functionality
                                      console.log("View students");
                                    }}
                                  >
                                    <Users className="h-4 w-4" />
                                    Students
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="flex items-center gap-2 rounded-xl"
                                    onClick={() => {
                                      // Add view schedule functionality
                                      console.log("View schedule");
                                    }}
                                  >
                                    <CalendarDays className="h-4 w-4" />
                                    Schedule
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="attendance">
              <Card className="hover:shadow-lg transition-all duration-200 rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Attendance Management</CardTitle>
                      <CardDescription>Start and manage attendance sessions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="course-select">Select Course</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                          <SelectTrigger id="course-select" className="w-full rounded-xl bg-white dark:bg-gray-800">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course.code} value={course.code}>
                                {course.code} - {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="attendance-date">Attendance Date</Label>
                        <Input 
                          id="attendance-date"
                          type="date" 
                          value={attendanceDate} 
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="rounded-xl bg-white dark:bg-gray-800" 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="attendance-mode">Verification Mode</Label>
                        <Select 
                          value={currentAttendanceMode} 
                          onValueChange={(value) => setCurrentAttendanceMode(value as "default" | "rfid")}
                        >
                          <SelectTrigger id="attendance-mode" className="w-full rounded-xl bg-white dark:bg-gray-800">
                            <SelectValue placeholder="Select verification mode" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="default">Fingerprint (Default)</SelectItem>
                            <SelectItem value="rfid">RFID Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <Button
                          variant="default"
                          className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleStartAttendance}
                          disabled={isTakingAttendance}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Start Attendance
                        </Button>
                        <div className="space-x-2">
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={handleExportPDF}
                            disabled={isExporting}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Export PDF
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            onClick={handleExportExcel}
                            disabled={isExporting}
                          >
                            <Table className="mr-2 h-4 w-4" />
                            Export CSV
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">System Status</h3>
                        <Badge variant={isTakingAttendance ? "default" : "outline"} className="rounded-xl">
                          {isTakingAttendance ? "Active" : "Idle"}
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Registered Students</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">42 students enrolled</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Current Attendance</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isTakingAttendance ? 
                                  `${students.filter(s => s.present).length} of ${students.length} present` : 
                                  "No active session"
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                              <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Device Status</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isTakingAttendance ? 
                                  `Ready - ${currentAttendanceMode === "default" ? "Fingerprint" : "RFID"}` : 
                                  "Standby"
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Recent Attendance Sessions</h3>
                      <div className="w-60">
                        <Label className="text-sm mb-1 block">Filter by Course</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                          <SelectTrigger className="rounded-xl bg-white dark:bg-gray-800">
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course.code} value={course.code}>
                                {course.code} - {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {filteredAttendanceData.map((record, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors duration-200"
                        >
                          <div className="flex flex-wrap items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold shadow-md">
                                {record.course.split(' ')[1]}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white text-lg">{record.course}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{record.date}, {record.time}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-3">
                              <div className="bg-white dark:bg-gray-700 px-3 py-2 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{record.present}/{record.total}</p>
                              </div>
                              <div className="bg-white dark:bg-gray-700 px-3 py-2 rounded-xl shadow-sm">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                                <p className="font-semibold text-green-600 dark:text-green-400">{record.percentage}%</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-2 rounded-xl ml-2"
                                onClick={() => {
                                  // View detailed attendance record
                                  console.log("View attendance details", record);
                                }}
                              >
                                View Details
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription>Manage your account preferences</CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2 rounded-xl"
                        onClick={() => {
                          // Add edit profile functionality
                          console.log("Edit profile");
                        }}
                      >
                        <Settings className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200">
                          SP
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Staff Profile</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Update your profile information</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Full Name</Label>
                          <Input placeholder="Enter your full name" className="bg-white dark:bg-gray-800 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input placeholder="Enter your email" type="email" className="bg-white dark:bg-gray-800 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input placeholder="Enter your department" className="bg-white dark:bg-gray-800 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input placeholder="Enter your phone number" type="tel" className="bg-white dark:bg-gray-800 rounded-xl" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4">
                        <Button 
                          variant="outline" 
                          className="rounded-xl"
                          onClick={() => {
                            // Add cancel functionality
                            console.log("Cancel changes");
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 transition-colors duration-200 rounded-xl"
                          onClick={() => {
                            // Add save changes functionality
                            console.log("Save changes");
                          }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 