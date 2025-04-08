import { db } from "@/lib/db"
import { hashPassword } from "@/lib/password-util"

interface StaffRegistrationData {
  name: string
  email: string
  staffId: string
  department: string
  password: string
}

interface StudentRegistrationData {
  name: string
  email: string
  matricNo: string
  department: string
  level: string
  password: string
}

export async function registerStaff(data: StaffRegistrationData) {
  const hashedPassword = await hashPassword(data.password)
  
  const staff = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      staffId: data.staffId,
      department: data.department,
      password: hashedPassword,
      role: "staff"
    }
  })

  const { password: _, ...staffWithoutPassword } = staff
  return staffWithoutPassword
}

export async function registerStudent(data: StudentRegistrationData) {
  const hashedPassword = await hashPassword(data.password)
  
  const student = await db.user.create({
    data: {
      name: data.name,
      email: data.email,
      matricNo: data.matricNo,
      department: data.department,
      level: data.level,
      password: hashedPassword,
      role: "student"
    }
  })

  const { password: _, ...studentWithoutPassword } = student
  return studentWithoutPassword
} 