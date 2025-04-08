import { NextResponse } from "next/server"
import { z } from "zod"
import rateLimit from "@/lib/rate-limit"
import { auth } from "@/lib/auth/config"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth/config"
import { verifyBiometric } from "@/lib/biometric/verify"

// Input validation schema
const attendanceSchema = z.object({
  sessionId: z.string(),
  studentId: z.string(),
  status: z.enum(["present", "absent", "late"]),
  checkInMethod: z.enum(["biometric", "manual", "qr_code"])
})

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const attendanceRecords = await db.attendanceRecord.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(attendanceRecords)
  } catch (error) {
    console.error("Attendance fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // Verify ESP32 auth token
    const authToken = req.headers.get("X-Auth-Token")
    if (authToken !== process.env.ESP32_AUTH_TOKEN) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { fingerprintId, rfidTag, deviceId } = await req.json()

    if (!fingerprintId && !rfidTag) {
      return NextResponse.json(
        { error: "No identification provided" },
        { status: 400 }
      )
    }

    // Verify biometric/RFID
    const verificationResult = await verifyBiometric(fingerprintId, rfidTag)

    if (!verificationResult.success) {
      return NextResponse.json(
        { 
          error: verificationResult.message,
          requiresRFID: verificationResult.requiresRFID,
          failedAttempts: verificationResult.failedAttempts
        },
        { status: 401 }
      )
    }

    // Record attendance
    const attendance = await db.attendance.create({
      data: {
        userId: verificationResult.userId!,
        deviceId,
        verificationMethod: rfidTag ? "RFID" : "FINGERPRINT"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Attendance recorded successfully",
      attendance
    })

  } catch (error) {
    console.error("Attendance recording error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 