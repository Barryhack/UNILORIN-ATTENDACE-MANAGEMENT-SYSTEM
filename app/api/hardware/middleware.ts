import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  try {
    const session = await auth()

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    // Add device authentication token
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('X-Device-Token', process.env.ESP32_AUTH_TOKEN || '')

    // Continue with added auth headers
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}

export const config = {
  matcher: [
    '/api/hardware/start-registration',
    '/api/hardware/check-rfid-status',
    '/api/hardware/start-fingerprint',
    '/api/hardware/check-fingerprint-status',
  ]
} 