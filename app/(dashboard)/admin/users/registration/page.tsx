"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Steps, Step } from "@/components/ui/steps"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select"
import { deviceSocket } from "@/lib/services/deviceSocket"
import { 
  UserPlus, 
  Fingerprint,
  CreditCard,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  UserCog,
  GraduationCap,
} from "lucide-react"

// Form validation schema
const userFormSchema = z.object({
  type: z.enum(["staff", "student"], {
    required_error: "Please select a user type",
  }),
  name: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  department: z.string({
    required_error: "Please select a department",
  }),
  matricNo: z.string().optional(),
  level: z.string().optional(),
})

type UserFormValues = z.infer<typeof userFormSchema>

// Define better structured data for dropdowns
const departmentGroups = [
  {
    label: "Sciences",
    departments: [
      { id: "cs", name: "Computer Science" },
      { id: "phy", name: "Physics" },
      { id: "math", name: "Mathematics" },
      { id: "bio", name: "Biology" }
    ]
  },
  {
    label: "Engineering",
    departments: [
      { id: "ee", name: "Electrical Engineering" },
      { id: "me", name: "Mechanical Engineering" },
      { id: "ce", name: "Civil Engineering" },
      { id: "che", name: "Chemical Engineering" }
    ]
  }
]

const levels = [
  {
    label: "Undergraduate",
    options: [
      { value: "100", label: "100 Level" },
      { value: "200", label: "200 Level" },
      { value: "300", label: "300 Level" },
      { value: "400", label: "400 Level" }
    ]
  },
  {
    label: "Postgraduate",
    options: [
      { value: "msc", label: "Masters" },
      { value: "phd", label: "Doctorate" }
    ]
  }
]

export default function UserRegistration() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState({
    connected: false,
    message: "Device not connected"
  })
  const [registrationStatus, setRegistrationStatus] = useState({
    rfid: false,
    fingerprint1: false,
    fingerprint2: false
  })

  // Initialize form with react-hook-form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      type: undefined,
      name: "",
      email: "",
      department: "",
    },
  })

  // Handle form submission
  const onSubmit = async (data: UserFormValues) => {
    try {
      setIsProcessing(true)
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to create user')

      const userData = await response.json()
      form.setValue('id', userData.userId)
      setStep(2) // Move to RFID registration
      toast({
        title: "Success",
        description: "User information saved successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save user information"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Connect to device and initiate registration mode
  const initiateRegistration = async () => {
    try {
      setIsProcessing(true)
      await deviceSocket.connect('ws://your-esp32-ip:port')
      
      // Send command to enter registration mode
      deviceSocket.send({
        command: 'ENTER_REGISTRATION_MODE'
      })

      setDeviceStatus({
        connected: true,
        message: "Device ready for registration"
      })

      // Listen for device messages
      deviceSocket.on('message', handleDeviceMessage)

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect to registration device"
      })
      setDeviceStatus({
        connected: false,
        message: "Failed to connect to device"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle messages from the device
  const handleDeviceMessage = (message: any) => {
    switch (message.type) {
      case 'RFID_SCAN':
        if (message.success) {
          setRegistrationStatus(prev => ({ ...prev, rfid: true }))
          toast({
            title: "RFID Registered",
            description: "RFID card successfully registered"
          })
        }
        break

      case 'FINGERPRINT_SCAN_1':
        if (message.success) {
          setRegistrationStatus(prev => ({ ...prev, fingerprint1: true }))
          toast({
            title: "First Scan Complete",
            description: "Please scan your finger again for verification"
          })
        }
        break

      case 'FINGERPRINT_SCAN_2':
        if (message.success) {
          setRegistrationStatus(prev => ({ ...prev, fingerprint2: true }))
          toast({
            title: "Biometric Registration Complete",
            description: "Fingerprint successfully registered"
          })
          // Move to next step if both scans are successful
          if (registrationStatus.fingerprint1) {
            setStep(4) // Move to course assignment
          }
        }
        break

      case 'ERROR':
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: message.error
        })
        break
    }
  }

  // Start RFID registration
  const startRFIDRegistration = async () => {
    try {
      deviceSocket.send({
        command: 'START_RFID_REGISTRATION',
        userId: form.watch("id")
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start RFID registration"
      })
    }
  }

  // Start fingerprint registration
  const startFingerprintRegistration = async () => {
    try {
      deviceSocket.send({
        command: 'START_FINGERPRINT_REGISTRATION',
        userId: form.watch("id")
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start fingerprint registration"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Registration</h1>
          <p className="text-muted-foreground">Register new users with biometric and RFID</p>
        </div>
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={isProcessing}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registration Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Steps value={step} className="mb-8">
            <Step value={1} title="Basic Info" />
            <Step value={2} title="RFID" />
            <Step value={3} title="Biometric" />
            <Step value={4} title="Courses" />
          </Steps>

          {step === 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select user type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-md">
                          <SelectGroup>
                            <SelectItem value="staff" className="flex items-center gap-2">
                              <UserCog className="h-4 w-4" />
                              <div>
                                <div>Staff</div>
                                <div className="text-xs text-muted-foreground">
                                  Lecturers and administrative staff
                                </div>
                              </div>
                            </SelectItem>
                            <SelectSeparator className="my-1" />
                            <SelectItem value="student" className="flex items-center gap-2">
                              <GraduationCap className="h-4 w-4" />
                              <div>
                                <div>Student</div>
                                <div className="text-xs text-muted-foreground">
                                  Undergraduate and postgraduate students
                                </div>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the type of user you want to register
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-md">
                          {departmentGroups.map(group => (
                            <SelectGroup key={group.label}>
                              <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                {group.label}
                              </SelectLabel>
                              {group.departments.map(dept => (
                                <SelectItem
                                  key={dept.id}
                                  value={dept.id}
                                  className="pl-4"
                                >
                                  {dept.name}
                                </SelectItem>
                              ))}
                              <SelectSeparator className="my-1" />
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the department this user belongs to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("type") === "student" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="matricNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matric Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter matric number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border shadow-md">
                              {levels.map(group => (
                                <SelectGroup key={group.label}>
                                  <SelectLabel className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                                    {group.label}
                                  </SelectLabel>
                                  {group.options.map(option => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                      className="pl-4"
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                  <SelectSeparator className="my-1" />
                                </SelectGroup>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {field.value?.includes("msc") || field.value?.includes("phd") 
                              ? "Postgraduate level"
                              : "Current year of study"
                            }
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isProcessing || !form.formState.isValid}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {(step === 2 || step === 3) && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {step === 2 ? (
                  <CreditCard className="h-8 w-8 text-primary" />
                ) : (
                  <Fingerprint className="h-8 w-8 text-primary" />
                )}
                <div>
                  <h3 className="font-semibold">
                    {step === 2 ? "RFID Registration" : "Biometric Registration"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step === 2 
                      ? "Please scan the RFID card on the reader"
                      : "Place your finger on the scanner twice for verification"
                    }
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">Device Status</p>
                    <p className="text-sm text-muted-foreground">
                      {deviceStatus.message}
                    </p>
                  </div>
                  <Badge variant={deviceStatus.connected ? "default" : "destructive"}>
                    {deviceStatus.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
              </div>

              {step === 2 && registrationStatus.rfid && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>RFID Registration Complete</span>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {registrationStatus.fingerprint1 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>First Scan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {registrationStatus.fingerprint2 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>Second Scan (Verification)</span>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {!deviceStatus.connected && (
                  <Button
                    variant="outline"
                    onClick={initiateRegistration}
                    disabled={isProcessing}
                  >
                    Connect Device
                  </Button>
                )}
                
                {deviceStatus.connected && (
                  <Button
                    onClick={step === 2 ? startRFIDRegistration : startFingerprintRegistration}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Start ${step === 2 ? 'RFID' : 'Fingerprint'} Registration`
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl">Registration Complete</h3>
                <p className="text-muted-foreground">
                  User has been successfully registered with both biometric and RFID
                </p>
              </div>
              <Button onClick={() => window.location.href = `/admin/users/${form.watch("id")}/courses`}>
                Proceed to Course Assignment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 