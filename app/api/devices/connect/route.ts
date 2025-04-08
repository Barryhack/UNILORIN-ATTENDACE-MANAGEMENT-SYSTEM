import { NextResponse } from "next/server"
import { deviceSocket } from "@/lib/services/deviceSocket"

export async function POST() {
  try {
    await deviceSocket.connect('ws://your-esp32-ip:port')
    return NextResponse.json({ 
      success: true, 
      message: "Connected to device successfully" 
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: getErrorMessage(error)
    }, { status: 500 })
  }
} 