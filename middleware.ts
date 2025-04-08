import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

interface Token {
  role?: string
  [key: string]: any
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request }) as Token | null
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/error", "/api/auth"]
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check if user is authenticated
  if (!token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  // Role-based access control
  const userRole = token.role?.toUpperCase()
  
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/auth/error", request.url))
  }

  if (pathname.startsWith("/staff") && userRole !== "STAFF") {
    return NextResponse.redirect(new URL("/auth/error", request.url))
  }

  if (pathname.startsWith("/student") && userRole !== "STUDENT") {
    return NextResponse.redirect(new URL("/auth/error", request.url))
  }

  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
} 