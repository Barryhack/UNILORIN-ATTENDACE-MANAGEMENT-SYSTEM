import { db } from "@/lib/db"

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email }
    })
    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id }
    })
    return user
  } catch (error) {
    console.error("Error getting user by id:", error)
    return null
  }
} 