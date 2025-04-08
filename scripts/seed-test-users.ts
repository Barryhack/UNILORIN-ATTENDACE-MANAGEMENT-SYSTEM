import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function seedTestUsers() {
  try {
    // Create test staff user
    const staffPassword = await hashPassword("staff123")
    const staff = await prisma.user.create({
      data: {
        name: "Dr. John Smith",
        email: "john.smith@example.com",
        password: staffPassword,
        role: "staff",
        department: "Computer Science",
        staffId: "STF001"
      }
    })
    console.log("Staff user created:", {
      name: staff.name,
      email: staff.email,
      role: staff.role,
      staffId: staff.staffId
    })

    // Create test student user
    const studentPassword = await hashPassword("student123")
    const student = await prisma.user.create({
      data: {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        password: studentPassword,
        role: "student",
        department: "Computer Science",
        matricNo: "CSC/2020/001",
        level: "300"
      }
    })
    console.log("Student user created:", {
      name: student.name,
      email: student.email,
      role: student.role,
      matricNo: student.matricNo,
      level: student.level
    })

  } catch (error) {
    console.error("Failed to create test users:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestUsers() 