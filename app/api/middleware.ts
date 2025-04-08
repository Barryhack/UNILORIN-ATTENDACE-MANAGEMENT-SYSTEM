import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Only apply to hardware endpoints
  if (!request.nextUrl.pathname.startsWith('/api/hardware')) {
    return NextResponse.next()
  }

  try {
    // Verify ESP32 connection before proceeding
    const deviceStatus = await fetch('http://esp32-ip-address/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!deviceStatus.ok) {
      throw new Error('Device not available')
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Hardware communication error:', error)
    return NextResponse.json(
      { error: 'Hardware device not available' },
      { status: 503 }
    )
  }
}

export const config = {
  matcher: '/api/hardware/:path*'
} 