import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    // Check RFID registration status from ESP32
    const deviceResponse = await fetch('http://esp32-ip-address/check-rfid', {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!deviceResponse.ok) {
      throw new Error('RFID registration failed')
    }

    const { rfidId } = await deviceResponse.json()

    // Store RFID ID in your database
    await fetch('/api/db/update-user', {
      method: 'POST',
      body: JSON.stringify({ userId, rfidId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Check RFID status error:', error)
    return NextResponse.json(
      { error: 'Failed to verify RFID registration' },
      { status: 500 }
    )
  }
} 