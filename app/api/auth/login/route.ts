import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth/server-utils"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 