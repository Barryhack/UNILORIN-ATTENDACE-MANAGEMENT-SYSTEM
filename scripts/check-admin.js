const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdminUsers() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    console.log('Admin users:', adminUsers)
  } catch (error) {
    console.error('Error checking admin users:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminUsers() 