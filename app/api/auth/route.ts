import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { staffId, password } = body

    // In a real app, you would validate credentials against a database
    if (staffId === "admin" && password === "password") {
      return NextResponse.json({
        success: true,
        user: {
          id: "1",
          name: "Admin User",
          role: "admin",
        },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

