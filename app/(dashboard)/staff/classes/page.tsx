"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  BookOpen, 
  Users, 
  Calendar,
  Clock,
  BarChart,
  Plus,
  Search,
  MoreVertical,
  CheckCircle 
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data
const classes = [
  {
    id: "1",
    code: "CSC 401",
    title: "Database Management Systems",
    students: 45,
    attendance: 92,
    schedule: "Mon, Wed 9:00 AM",
    venue: "LT1",
    nextClass: "Tomorrow at 9:00 AM",
    status: "active"
  },
  {
    id: "2",
    code: "CSC 403",
    title: "Software Engineering",
    students: 38,
    attendance: 85,
    schedule: "Tue, Thu 11:00 AM",
    venue: "LT2",
    nextClass: "Today at 11:00 AM",
    status: "active"
  },
  // Add more classes...
]

export default function StaffClasses() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your courses and class schedules</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
              <DialogDescription>
                Create a new class and set up its details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="course-code">Course Code</Label>
                <Input id="course-code" placeholder="e.g. CSC 401" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title</Label>
                <Input id="course-title" placeholder="e.g. Database Management Systems" />
              </div>
              {/* Add more fields as needed */}
            </div>
            <div className="flex justify-end">
              <Button>Create Class</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <Label htmlFor="search-classes">Search Classes</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-classes"
              placeholder="Search by course code or title..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map(course => (
          <Card key={course.id} className="relative group">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {course.code}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{course.title}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Take Attendance
                    </DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Edit Class</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Class Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    Students
                  </div>
                  <p className="text-xl font-bold">{course.students}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BarChart className="mr-2 h-4 w-4" />
                    Attendance
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={course.attendance} className="flex-1" />
                    <span className="text-sm font-medium">{course.attendance}%</span>
                  </div>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-primary font-medium">{course.nextClass}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 