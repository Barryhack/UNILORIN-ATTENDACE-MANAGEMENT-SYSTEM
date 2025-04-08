"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timeout = setTimeout(() => {
      router.push("/auth/login")
    }, 3000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Authentication Error</h1>
            <p className="text-gray-600">
              {error === "CredentialsSignin" 
                ? "Invalid email or password" 
                : "An error occurred during authentication"}
            </p>
          </div>
          
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Return to Login
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Go to Homepage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 