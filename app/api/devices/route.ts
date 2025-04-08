import { NextResponse } from "next/server"

export async function GET() {
  // Mock device data
  const devices = [
    {
      id: "DEV001",
      name: "Main Entrance",
      location: "Building A",
      status: "ONLINE",
      lastSeen: new Date().toISOString()
    }
    // Add more mock devices
  ]

  return NextResponse.json({ devices })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate device data
    if (!body.name || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Mock device registration
    return NextResponse.json({
      success: true,
      message: "Device registered successfully"
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 