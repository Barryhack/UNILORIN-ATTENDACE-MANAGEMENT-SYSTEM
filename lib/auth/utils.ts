import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "./config"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const path = request.nextUrl.pathname

  // Public paths that don't require authentication
  if (path === "/" || path.startsWith("/auth")) {
    return NextResponse.next()
  }

  if (!session?.user) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Role-based access control
  if (
    (path.startsWith("/admin") && session.user.role !== "admin") ||
    (path.startsWith("/staff") && session.user.role !== "staff") ||
    (path.startsWith("/student") && session.user.role !== "student")
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
} 