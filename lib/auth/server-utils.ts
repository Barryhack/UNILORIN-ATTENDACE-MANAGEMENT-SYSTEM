import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findFirst({
    where: {
      OR: [
        { email },
        { matricNo: email },
        { staffId: email }
      ]
    }
  })

  if (!user) {
    return null
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
} 