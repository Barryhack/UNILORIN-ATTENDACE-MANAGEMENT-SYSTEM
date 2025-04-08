"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  BookOpen, 
  Search, 
  MoreVertical,
  Download,
  Plus,
  Users,
  Calendar,
  Clock
} from "lucide-react"

// Mock data
const courses = [
  {
    id: "CSC101",
    code: "CSC101",
    title: "Introduction to Computer Science",
    department: "Computer Science",
    level: "100",
    lecturer: "Dr. John Smith",
    students: 150,
    schedule: "Mon, Wed, Fri 10:00 AM",
    status: "active"
  },
  {
    id: "CSC201",
    code: "CSC201",
    title: "Data Structures and Algorithms",
    department: "Computer Science",
    level: "200",
    lecturer: "Dr. Sarah Johnson",
    students: 120,
    schedule: "Tue, Thu 2:00 PM",
    status: "active"
  },
  {
    id: "CSC301",
    code: "CSC301",
    title: "Database Systems",
    department: "Computer Science",
    level: "300",
    lecturer: "Dr. Michael Brown",
    students: 100,
    schedule: "Mon, Wed 1:00 PM",
    status: "inactive"
  }
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] bg-clip-text text-transparent">
            Course Management
          </h1>
          <p className="text-muted-foreground">Manage academic courses and schedules</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl bg-white border shadow-md">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>
                  Create a new course in the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Course Code</Label>
                    <Input id="code" placeholder="CSC101" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input id="title" placeholder="Introduction to Computer Science" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" placeholder="Computer Science" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input id="level" placeholder="100" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lecturer">Lecturer</Label>
                  <Input id="lecturer" placeholder="Dr. John Smith" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input id="schedule" placeholder="Mon, Wed, Fri 10:00 AM" className="rounded-xl" />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-8 w-[250px] rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Courses Table */}
      <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.level}</TableCell>
                  <TableCell>{course.lecturer}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {course.students}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {course.schedule}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={course.status === "active" ? "default" : "destructive"}
                      className="rounded-lg"
                    >
                      {course.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          View Students
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Edit Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Deactivate Course
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 