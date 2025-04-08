import { db } from "@/lib/db"

interface BiometricVerificationResult {
  success: boolean
  userId?: string
  message: string
  requiresRFID?: boolean
  failedAttempts?: number
}

export async function verifyBiometric(fingerprintId: string, rfidId?: string): Promise<BiometricVerificationResult> {
  try {
    // Check if user exists with this fingerprint
    const user = await db.user.findFirst({
      where: {
        fingerprintId
      }
    })

    if (user) {
      return {
        success: true,
        userId: user.id,
        message: "Biometric verification successful"
      }
    }

    // If RFID is provided as fallback
    if (rfidId) {
      const userByRFID = await db.user.findFirst({
        where: {
          rfidId
        }
      })

      if (userByRFID) {
        return {
          success: true,
          userId: userByRFID.id,
          message: "RFID verification successful"
        }
      }
    }

    return {
      success: false,
      message: "Verification failed",
      requiresRFID: true,
      failedAttempts: 1
    }
  } catch (error) {
    console.error("Biometric verification error:", error)
    return {
      success: false,
      message: "Internal server error during verification"
    }
  }
} 