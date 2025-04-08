const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

async function seedTestUsers() {
  try {
    // Check if staff user exists
    const existingStaff = await prisma.user.findUnique({
      where: { email: "john.smith@example.com" }
    })

    if (!existingStaff) {
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
    } else {
      console.log("Staff user already exists:", {
        name: existingStaff.name,
        email: existingStaff.email,
        role: existingStaff.role,
        staffId: existingStaff.staffId
      })
    }

    // Check if student user exists
    const existingStudent = await prisma.user.findUnique({
      where: { email: "alice.j@example.com" }
    })

    if (!existingStudent) {
      // Create test student user
      const studentPassword = await hashPassword("student123")
      const student = await prisma.user.create({
        data: {
          name: "Alice Johnson",
          email: "alice.j@example.com",
          password: studentPassword,
          role: "student",
          department: "Computer Science",
          matricNo: "CSC/2020/002",
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
    } else {
      console.log("Student user already exists:", {
        name: existingStudent.name,
        email: existingStudent.email,
        role: existingStudent.role,
        matricNo: existingStudent.matricNo,
        level: existingStudent.level
      })
    }

  } catch (error) {
    console.error("Failed to create test users:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestUsers() 