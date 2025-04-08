import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    // Send command to ESP32 to start fingerprint registration
    const deviceResponse = await fetch('http://esp32-ip-address/start-fingerprint', {
      method: 'POST',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!deviceResponse.ok) {
      throw new Error('Failed to start fingerprint registration')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Start fingerprint error:', error)
    return NextResponse.json(
      { error: 'Failed to start fingerprint registration' },
      { status: 500 }
    )
  }
} 