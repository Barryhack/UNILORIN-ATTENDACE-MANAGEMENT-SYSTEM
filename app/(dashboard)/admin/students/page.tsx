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
  DialogFooter,
  DialogClose,
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
  XCircle,
  Plus,
  Loader2,
  Save
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Link from "next/link"

// Mock data
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
  {
    id: "STD002",
    name: "Bob Smith",
    matricNo: "CSC/2020/002",
    department: "Computer Science",
    level: "300",
    status: "active",
    registered: "2024-01-11",
    lastActive: "2 hours ago",
    biometricStatus: "registered",
    rfidStatus: "registered"
  },
  {
    id: "STD003",
    name: "Carol White",
    matricNo: "CSC/2020/003",
    department: "Computer Science",
    level: "300",
    status: "inactive",
    registered: "2024-01-12",
    lastActive: "1 day ago",
    biometricStatus: "registered",
    rfidStatus: "pending"
  }
]

const ESP32_BASE_URL = "http://192.168.1.100:80";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isRegisteringHardware, setIsRegisteringHardware] = useState(false)
  const [registrationStep, setRegistrationStep] = useState("details") // details, hardware
  const [hardwareStatus, setHardwareStatus] = useState({
    rfid: { status: "pending", id: null },
    fingerprint: { status: "pending", id: null, attempts: 0 }
  })
  const [registrationInProgress, setRegistrationInProgress] = useState(false)
  const [includeHardwareRegistration, setIncludeHardwareRegistration] = useState(false)
  
  const [newStudent, setNewStudent] = useState({
    name: "",
    matricNo: "",
    department: "",
    level: ""
  })

  const handleStudentChange = (field, value) => {
    setNewStudent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleStartHardwareRegistration = async () => {
    // Validate student details
    if (!newStudent.name || !newStudent.matricNo || !newStudent.department || !newStudent.level) {
      toast.error("Please fill all student details")
      return
    }
    
    // Move to hardware registration step
    setRegistrationStep("hardware")
    setRegistrationInProgress(true)
    
    try {
      // First create the student record in database
      // This would be an API call to create the student with pending hardware registration
      toast.success("Student details saved, starting hardware registration")
      
      // Start registration mode on ESP32
      const response = await fetch(`${ESP32_BASE_URL}/start-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: newStudent.matricNo,
          mode: "both" // Register both RFID and fingerprint
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to start hardware registration")
      }
      
      // Set up event source to listen for registration events
      const eventSource = new EventSource(`${ESP32_BASE_URL}/registration-events?studentId=${newStudent.matricNo}`)
      
      eventSource.addEventListener("rfid-scan", (event) => {
        const data = JSON.parse(event.data)
        setHardwareStatus(prev => ({
          ...prev,
          rfid: { status: "complete", id: data.rfidId }
        }))
        toast.success("RFID card registered successfully")
      })
      
      eventSource.addEventListener("fingerprint-scan", (event) => {
        const data = JSON.parse(event.data)
        setHardwareStatus(prev => ({
          ...prev,
          fingerprint: { 
            ...prev.fingerprint,
            attempts: data.attempt
          }
        }))
        
        if (data.status === "complete") {
          setHardwareStatus(prev => ({
            ...prev,
            fingerprint: { 
              status: "complete", 
              id: data.fingerprintId,
              attempts: 2
            }
          }))
          toast.success("Fingerprint registered successfully")
        } else if (data.status === "partial") {
          toast.info(`Fingerprint scan ${data.attempt} of 2 complete. Please scan again.`)
        }
      })
      
      eventSource.addEventListener("error", (event) => {
        const data = JSON.parse(event.data)
        toast.error(`Registration error: ${data.message}`)
        eventSource.close()
        setRegistrationInProgress(false)
      })
      
      eventSource.addEventListener("registration-complete", () => {
        toast.success("Hardware registration completed successfully")
        eventSource.close()
        setRegistrationInProgress(false)
        
        // Update student record with hardware IDs
        // This would be an API call to update the student record
      })
      
      // Close event source when component unmounts
      return () => {
        eventSource.close()
      }
    } catch (error) {
      console.error("Hardware registration error:", error)
      toast.error("Failed to start hardware registration")
      setRegistrationInProgress(false)
    }
  }
  
  const handleCancelRegistration = async () => {
    try {
      await fetch(`${ESP32_BASE_URL}/cancel-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: newStudent.matricNo
        }),
      })
      
      toast.info("Hardware registration cancelled")
      setRegistrationStep("details")
      setRegistrationInProgress(false)
      setHardwareStatus({
        rfid: { status: "pending", id: null },
        fingerprint: { status: "pending", id: null, attempts: 0 }
      })
    } catch (error) {
      console.error("Cancel registration error:", error)
      toast.error("Failed to cancel registration")
    }
  }
  
  const handleCompleteRegistration = async () => {
    try {
      // Save student with hardware IDs
      // This would be an API call to save the student
      toast.success("Student registered successfully")
      
      // Reset form
      setNewStudent({
        name: "",
        matricNo: "",
        department: "",
        level: ""
      })
      setRegistrationStep("details")
      setHardwareStatus({
        rfid: { status: "pending", id: null },
        fingerprint: { status: "pending", id: null, attempts: 0 }
      })
      setIncludeHardwareRegistration(false)
    } catch (error) {
      console.error("Registration completion error:", error)
      toast.error("Failed to complete registration")
    }
  }
  
  const handleRegisterIndividualHardware = async (studentId, type) => {
    try {
      setIsRegisteringHardware(true)
      
      // Start registration mode on ESP32
      const response = await fetch(`${ESP32_BASE_URL}/start-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          mode: type // "rfid" or "fingerprint"
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to start ${type} registration`)
      }
      
      toast.success(`${type === "rfid" ? "RFID" : "Fingerprint"} registration started`)
      
      // For demonstration purposes, show a success message
      setTimeout(() => {
        toast.success(`${type === "rfid" ? "RFID" : "Fingerprint"} registered successfully`)
        setIsRegisteringHardware(false)
      }, 3000)
    } catch (error) {
      console.error(`${type} registration error:`, error)
      toast.error(`Failed to register ${type}`)
      setIsRegisteringHardware(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-muted-foreground">Manage student accounts and registrations</p>
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
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-xl bg-white border shadow-md">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  {registrationStep === "details" 
                    ? "Register a new student in the system" 
                    : "Complete hardware registration process"}
                </DialogDescription>
              </DialogHeader>
              
              {registrationStep === "details" ? (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        className="rounded-xl" 
                        value={newStudent.name}
                        onChange={(e) => handleStudentChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="matricNo">Matriculation Number</Label>
                      <Input 
                        id="matricNo" 
                        placeholder="CSC/2020/001" 
                        className="rounded-xl" 
                        value={newStudent.matricNo}
                        onChange={(e) => handleStudentChange("matricNo", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={newStudent.department}
                      onValueChange={(value) => handleStudentChange("department", value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <Select
                      value={newStudent.level}
                      onValueChange={(value) => handleStudentChange("level", value)}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="100">100 Level</SelectItem>
                        <SelectItem value="200">200 Level</SelectItem>
                        <SelectItem value="300">300 Level</SelectItem>
                        <SelectItem value="400">400 Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="hardware-registration">
                        Include Hardware Registration
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Register RFID and fingerprint now
                      </p>
                    </div>
                    <Switch
                      id="hardware-registration"
                      checked={includeHardwareRegistration}
                      onCheckedChange={setIncludeHardwareRegistration}
                    />
                  </div>
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      className="rounded-xl bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] text-white hover:opacity-90"
                      onClick={includeHardwareRegistration ? handleStartHardwareRegistration : handleCompleteRegistration}
                    >
                      {includeHardwareRegistration ? "Next: Hardware Registration" : "Save Student"}
                    </Button>
                  </DialogFooter>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium">Hardware Registration for {newStudent.name}</h3>
                    <p className="text-sm text-muted-foreground">{newStudent.matricNo}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* RFID Registration */}
                    <div className="border rounded-xl p-4 relative">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">RFID Card Registration</h4>
                        </div>
                        <Badge variant={hardwareStatus.rfid.status === "complete" ? "default" : "outline"}>
                          {hardwareStatus.rfid.status === "complete" ? "Registered" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please place the student's RFID card on the reader
                      </p>
                      {hardwareStatus.rfid.status === "complete" && (
                        <p className="text-sm text-green-600 mt-2">
                          RFID Card ID: {hardwareStatus.rfid.id}
                        </p>
                      )}
                    </div>
                    
                    {/* Fingerprint Registration */}
                    <div className="border rounded-xl p-4 relative">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="h-5 w-5 text-purple-500" />
                          <h4 className="font-medium">Fingerprint Registration</h4>
                        </div>
                        <Badge variant={hardwareStatus.fingerprint.status === "complete" ? "default" : "outline"}>
                          {hardwareStatus.fingerprint.status === "complete" ? "Registered" : "Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please place the student's finger on the scanner twice for verification
                      </p>
                      <div className="mt-3 flex gap-3">
                        <div className={`h-3 w-full rounded-full ${hardwareStatus.fingerprint.attempts >= 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className={`h-3 w-full rounded-full ${hardwareStatus.fingerprint.attempts >= 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      </div>
                      {hardwareStatus.fingerprint.status === "complete" && (
                        <p className="text-sm text-green-600 mt-2">
                          Fingerprint ID: {hardwareStatus.fingerprint.id}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter className="pt-4 flex items-center justify-between">
                    <Button 
                      variant="outline"
                      className="rounded-xl"
                      onClick={handleCancelRegistration}
                      disabled={registrationInProgress && (hardwareStatus.rfid.status === "complete" || hardwareStatus.fingerprint.status === "complete")}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="rounded-xl bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] text-white hover:opacity-90"
                      onClick={handleCompleteRegistration}
                      disabled={registrationInProgress}
                    >
                      {registrationInProgress ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Complete Registration
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              className="pl-8 w-[250px] rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px] rounded-xl">
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

      {/* Students Table */}
      <Card className="rounded-xl border-none shadow-sm hover:shadow-md transition-all duration-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Matric No.</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Biometric</TableHead>
                <TableHead>RFID</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.matricNo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{student.matricNo}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.level}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={student.status === "active" ? "default" : "destructive"}
                      className="rounded-lg"
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.biometricStatus === "registered" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {student.rfidStatus === "registered" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{student.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleRegisterIndividualHardware(student.id, "fingerprint")} disabled={isRegisteringHardware}>
                          <Fingerprint className="mr-2 h-4 w-4" />
                          Register Biometric
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRegisterIndividualHardware(student.id, "rfid")} disabled={isRegisteringHardware}>
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
    </div>
  )
} 