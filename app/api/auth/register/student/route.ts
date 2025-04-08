import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { registerStudent } from "@/lib/auth/register"

export async function POST(req: Request) {
  try {
    // Verify admin authorization
    const session = await getServerSession(authConfig)
    if (!session?.user?.role === "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await req.json()
    const student = await registerStudent(data)

    return NextResponse.json({
      success: true,
      user: student
    })
  } catch (error) {
    console.error("Student registration error:", error)
    return NextResponse.json(
      { error: "Failed to register student" },
      { status: 500 }
    )
  }
} 