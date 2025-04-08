import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    // Get all cookies
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully"
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })

    // Clear all cookies
    allCookies.forEach(cookie => {
      response.cookies.set(cookie.name, '', {
        path: '/',
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      })
    })

    // Explicitly clear auth cookies
    const authCookies = ['token', 'session', 'next-auth.session-token', '__Secure-next-auth.session-token']
    authCookies.forEach(name => {
      response.cookies.set(name, '', {
        path: '/',
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'lax'
      })
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    )
  }
} 