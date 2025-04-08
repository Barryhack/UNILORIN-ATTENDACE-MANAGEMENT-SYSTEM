"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, X } from "lucide-react"

interface Course {
  id: string
  code: string
  title: string
  department: string
  semester: string
}

interface UserCourse extends Course {
  enrolledAt: string
}

interface ErrorWithMessage {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    return new Error(String(maybeError))
  }
}

function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}

export default function UserCourses() {
  const params = useParams()
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [enrolledCourses, setEnrolledCourses] = useState<UserCourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchUserCourses()
    fetchAvailableCourses()
  }, [])

  const fetchUserCourses = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}/courses`)
      const data = await response.json()
      setEnrolledCourses(data.courses)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch enrolled courses"
      })
    }
  }

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      const data = await response.json()
      setAvailableCourses(data.courses)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch available courses"
      })
    }
  }

  const enrollCourse = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${params.id}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courseId: selectedCourse })
      })
      
      if (!response.ok) throw new Error("Failed to enroll in course")
      
      await fetchUserCourses()
      setSelectedCourse("")
      toast({
        title: "Success",
        description: "Course enrolled successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getErrorMessage(error)
      })
    } finally {
      setIsLoading(false)
    }
  }

  const unenrollCourse = async (courseId: string) => {
    try {
      const response = await fetch(`/api/users/${params.id}/courses/${courseId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error("Failed to unenroll from course")
      
      await fetchUserCourses()
      toast({
        title: "Success",
        description: "Course unenrolled successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: getErrorMessage(error)
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Management</h1>
          <p className="text-muted-foreground">Manage user course enrollments</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enroll in Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select
              value={selectedCourse}
              onValueChange={setSelectedCourse}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={enrollCourse}
              disabled={!selectedCourse || isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Enroll
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Enrolled On</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrolledCourses.map(course => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.department}</TableCell>
                  <TableCell>{course.semester}</TableCell>
                  <TableCell>{new Date(course.enrolledAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => unenrollCourse(course.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
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