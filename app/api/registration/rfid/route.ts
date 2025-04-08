import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    
    // Send command to ESP32 to start RFID registration
    const command = {
      type: "REGISTER_RFID",
      userId: userId
    }
    
    deviceSocket?.send(JSON.stringify(command))
    
    // Wait for response from ESP32
    const response = await new Promise((resolve, reject) => {
      deviceSocket?.on('message', (data) => {
        const result = JSON.parse(data.toString())
        if (result.success) {
          resolve(result)
        } else {
          reject(new Error(result.message))
        }
      })
      
      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error("Registration timed out"))
      }, 30000)
    })
    
    // Update user record with RFID ID
    await db.user.update({
      where: { id: userId },
      data: {
        rfidId: response.rfidId
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 })
  }
} 