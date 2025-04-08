import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { registerStaff } from "@/lib/auth/register"

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
    const staff = await registerStaff(data)

    return NextResponse.json({
      success: true,
      user: staff
    })
  } catch (error) {
    console.error("Staff registration error:", error)
    return NextResponse.json(
      { error: "Failed to register staff" },
      { status: 500 }
    )
  }
} 