"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
  const cookieStore = cookies()
  
  // Clear all authentication related cookies
  cookieStore.delete('token')
  cookieStore.delete('session')
  cookieStore.delete('next-auth.session-token')
  cookieStore.delete('__Secure-next-auth.session-token')
  
  // Clear all cookies to be safe
  const allCookies = cookieStore.getAll()
  allCookies.forEach(cookie => {
    cookieStore.delete(cookie.name)
  })

  // Redirect to login
  redirect('/login')
} 