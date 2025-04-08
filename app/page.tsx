import { redirect } from "next/navigation"
import { auth } from "@/lib/auth" // You'll need to implement this

export default async function Home() {
  // Add logic to determine user role from auth
  const userRole = 'student' // This should come from your auth system
  
  if (userRole === 'student') {
    redirect('/student/dashboard')
  } else if (userRole === 'admin') {
    redirect('/admin/dashboard')
  }
  
  // Default redirect to login if not authenticated
  redirect('/auth/login')
}

