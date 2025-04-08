import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    // Check admin authorization
    const session = await auth()
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, rfidId, fingerprintId } = await req.json()

    // Update user with hardware IDs
    await db.user.update({
      where: { id: userId },
      data: {
        ...(rfidId && { rfidId }),
        ...(fingerprintId && { fingerprintId }),
        hardwareRegistrationComplete: Boolean(rfidId && fingerprintId)
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user data' },
      { status: 500 }
    )
  }
} 