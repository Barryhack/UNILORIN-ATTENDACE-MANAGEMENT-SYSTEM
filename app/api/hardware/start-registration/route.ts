import { NextResponse } from 'next/server'
import { makeDeviceRequest, ESP32_CONFIG } from '@/lib/hardware'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    await makeDeviceRequest(ESP32_CONFIG.endpoints.startRegistration, {
      method: 'POST',
      body: JSON.stringify({ userId, mode: 'rfid' }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Start registration error:', error)
    return NextResponse.json(
      { error: 'Failed to start registration mode' },
      { status: 500 }
    )
  }
} 