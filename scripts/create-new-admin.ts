import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createNewAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    })

    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10)
    const admin = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@unilorin.edu.ng',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'Administration',
        staffId: 'ADM001'
      }
    })

    console.log('New admin user created successfully:', {
      email: admin.email,
      role: admin.role
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createNewAdmin() 