const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function createNewAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const newAdmin = await prisma.user.create({
      data: {
        name: 'New Admin',
        email: 'newadmin@unilorin.edu.ng',
        password: hashedPassword,
        role: 'ADMIN',
        department: 'Administration'
      }
    })

    console.log('New admin user created:', {
      id: newAdmin.id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createNewAdmin() 