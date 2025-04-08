import { db } from "@/lib/db"
import { hashPassword } from "@/lib/password-util"

async function createAdmin() {
  const hashedPassword = await hashPassword("admin123")
  
  try {
    const admin = await db.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        department: "Administration"
      }
    })

    console.log("Admin user created:", admin)
  } catch (error) {
    console.error("Failed to create admin:", error)
  }
}

createAdmin() 