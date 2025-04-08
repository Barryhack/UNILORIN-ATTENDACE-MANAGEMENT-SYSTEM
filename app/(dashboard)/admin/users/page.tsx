"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Users, 
  UserPlus, 
  Search, 
  MoreVertical,
  Download,
  Filter,
  Fingerprint,
  CreditCard,
  CheckCircle,
  XCircle
} from "lucide-react"
import Link from "next/link"

// Mock data
const staffMembers = [
  {
    id: "STF001",
    name: "Dr. John Smith",
    email: "john.smith@example.com",
    department: "Computer Science",
    role: "Lecturer",
    status: "active",
    registered: "2024-01-15",
    lastActive: "2 hours ago",
    biometricStatus: "registered",
    rfidStatus: "registered"
  },
  // Add more staff...
]

const students = [
  {
    id: "STD001",
    name: "Alice Johnson",
    matricNo: "CSC/2020/001",
    department: "Computer Science",
    level: "300",
    status: "active",
    registered: "2024-01-10",
    lastActive: "1 hour ago",
    biometricStatus: "pending",
    rfidStatus: "registered"
  },
  // Add more students...
]

export default function AdminUsers() {
  const [activeTab, setActiveTab] = useState("staff")
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [registrationStep, setRegistrationStep] = useState<'initial' | 'biometric' | 'rfid' | 'complete'>('initial')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage staff and student accounts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button asChild>
                <Link href="/admin/users/registration">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Link>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Register a new staff member or student
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="staff" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="staff">Staff</TabsTrigger>
                  <TabsTrigger value="student">Student</TabsTrigger>
                </TabsList>
                <TabsContent value="staff" className="space-y-4 mt-4">
                  {/* Staff registration form */}
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Dr. John Smith" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john.smith@example.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cs">Computer Science</SelectItem>
                          <SelectItem value="ee">Electrical Engineering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="student" className="space-y-4 mt-4">
                  {/* Student registration form */}
                  <div className="space-y-4">
                    {/* Similar fields as staff, plus additional student-specific fields */}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
          <TabsList>
            <TabsTrigger value="staff" className="relative">
              Staff
              <Badge className="ml-2 bg-primary/10 text-primary">
                {staffMembers.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="students">
              Students
              <Badge className="ml-2 bg-primary/10 text-primary">
                {students.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[180px]">
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

        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Biometric</TableHead>
                    <TableHead>RFID</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map(staff => (
                    <TableRow key={staff.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{staff.name}</p>
                          <p className="text-sm text-muted-foreground">{staff.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{staff.department}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={staff.status === "active" ? "default" : "destructive"}
                        >
                          {staff.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {staff.biometricStatus === "registered" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        {staff.rfidStatus === "registered" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>{staff.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Fingerprint className="mr-2 h-4 w-4" />
                              Register Biometric
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Register RFID
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Deactivate Account
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
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          {/* Similar table structure for students */}
        </TabsContent>
      </Tabs>
    </div>
  )
} 