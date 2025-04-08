"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, BookOpen, Clock, ChevronRight, CheckCircle, AlertCircle, UserCircle, LayoutDashboard, GraduationCap, CalendarDays, Settings, LogOut, FileText, Table, History, MessageSquare, Plus, MoreVertical } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AttendanceDetails } from "../components/AttendanceDetails"

export default function StudentDashboardPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCourse, setSelectedCourse] = useState<string>("all")
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Sample data - replace with actual data from your backend
  const courses = [
    { code: "CSC 401", name: "Computer Architecture", attendance: 85, nextClass: "Today, 2:00 PM", totalClasses: 20, attended: 17 },
    { code: "CSC 405", name: "Operating Systems", attendance: 92, nextClass: "Tomorrow, 10:00 AM", totalClasses: 15, attended: 14 },
    { code: "CSC 409", name: "Advanced Programming", attendance: 78, nextClass: "Friday, 1:00 PM", totalClasses: 18, attended: 14 }
  ]

  const attendanceHistory = [
    {
      course: "CSC 401",
      date: "2024-03-20",
      time: "2:00 PM",
      status: "present",
      timestamp: "2024-03-20T14:05:23",
      verificationMethod: "Fingerprint",
      location: "Room 101"
    },
    {
      course: "CSC 405",
      date: "2024-03-19",
      time: "10:00 AM",
      status: "present",
      timestamp: "2024-03-19T10:02:15",
      verificationMethod: "RFID",
      location: "Room 203"
    },
    {
      course: "CSC 409",
      date: "2024-03-18",
      time: "1:00 PM",
      status: "absent",
      timestamp: null,
      verificationMethod: null,
      location: "Room 305"
    }
  ]

  const handleViewDetails = (attendance: any) => {
    setSelectedAttendance(attendance)
    setIsDetailsOpen(true)
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
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
                  <p className="text-gray-600 dark:text-gray-400">Welcome back, Student</p>
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
                            <p className="text-sm text-gray-900 dark:text-white">New course material uploaded</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200 group">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg hover:shadow-xl transition-shadow duration-200">
                    SD
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Student Profile</p>
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
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Attendance</CardTitle>
                    <CheckCircle className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">85%</p>
                    <p className="ml-2 text-sm text-blue-500">Average</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <Progress value={85} className="h-1 rounded-full" />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last 30 days</p>
                      <p className="text-xs font-medium text-blue-500">85%</p>
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
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Class</CardTitle>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 group rounded-2xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Required</CardTitle>
                    <AlertCircle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex items-baseline mt-2">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">75%</p>
                    <p className="ml-2 text-sm text-red-500">Minimum</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <Progress value={85} className="h-1 rounded-full" />
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Current: 85%</p>
                      <p className="text-xs font-medium text-green-500">+10%</p>
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
                          <CardDescription>Latest updates from your courses</CardDescription>
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
                            title: "CSC 401 Assignment", 
                            time: "Due in 2 days", 
                            type: "assignment", 
                            status: "pending",
                            icon: <FileText className="h-5 w-5 text-blue-500" />
                          },
                          { 
                            title: "CSC 405 Quiz", 
                            time: "Completed", 
                            type: "quiz", 
                            status: "completed",
                            icon: <CheckCircle className="h-5 w-5 text-green-500" />
                          },
                          { 
                            title: "CSC 409 Project", 
                            time: "Due in 1 week", 
                            type: "project", 
                            status: "pending",
                            icon: <AlertCircle className="h-5 w-5 text-orange-500" />
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
                        <CardDescription>View your enrolled courses and materials</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((course, index) => (
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
                                    <Clock className="h-4 w-4 text-gray-500" />
                                    <span className="text-gray-500 dark:text-gray-400">{course.nextClass}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 dark:text-gray-400">Attendance Rate</span>
                                    <span className="font-medium text-blue-500">{course.attendance}%</span>
                                  </div>
                                  <Progress value={course.attendance} className="h-1 rounded-full" />
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
                                      // Add view attendance functionality
                                      console.log("View attendance");
                                    }}
                                  >
                                    <CalendarDays className="h-4 w-4" />
                                    Attendance
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

            <TabsContent value="attendance" className="space-y-6">
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
                          <CardTitle>Today's Classes</CardTitle>
                          <CardDescription>Your classes for today</CardDescription>
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
                      <div className="space-y-4">
                        {courses.filter(course => course.nextClass.includes("Today")).map((course, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{course.code} - {course.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{course.nextClass}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                {course.attendance}% attendance
                              </span>
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
                        ))}
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
                          <CardTitle>Attendance History</CardTitle>
                          <CardDescription>Your recent attendance records</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 rounded-xl"
                            onClick={() => {
                              // Add export functionality
                              console.log("Export attendance");
                            }}
                          >
                            <FileText className="h-4 w-4" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {attendanceHistory.map((record, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <CalendarDays className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{record.course}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{record.date}, {record.time}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {record.verificationMethod && `Verified by ${record.verificationMethod}`}
                                  {record.location && ` in ${record.location}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`text-sm px-3 py-1 rounded-xl ${
                                record.status === "present" 
                                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
                                  : "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                              }`}>
                                {record.status}
                              </span>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 rounded-xl"
                                onClick={() => handleViewDetails(record)}
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
          </Tabs>
        </div>
      </div>

      {/* Attendance Details Modal */}
      {selectedAttendance && (
        <AttendanceDetails
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false)
            setSelectedAttendance(null)
          }}
          attendance={selectedAttendance}
        />
      )}
    </div>
  )
} 