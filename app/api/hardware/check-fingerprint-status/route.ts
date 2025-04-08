import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    // Check fingerprint registration status from ESP32
    const deviceResponse = await fetch('http://esp32-ip-address/check-fingerprint', {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!deviceResponse.ok) {
      throw new Error('Fingerprint registration failed')
    }

    const { fingerprintId } = await deviceResponse.json()

    // Store fingerprint ID in your database
    await fetch('/api/db/update-user', {
      method: 'POST',
      body: JSON.stringify({ userId, fingerprintId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Check fingerprint status error:', error)
    return NextResponse.json(
      { error: 'Failed to verify fingerprint registration' },
      { status: 500 }
    )
  }
} 