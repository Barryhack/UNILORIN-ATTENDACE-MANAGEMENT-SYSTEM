"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        toast.error("Invalid credentials")
        return
      }

      // Wait a moment for the session to be set
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get the user's role from the session
      const response = await fetch("/api/auth/session")
      const session = await response.json()
      
      if (!session?.user?.role) {
        throw new Error("No role found in session")
      }

      // Redirect based on role
      const role = session.user.role.toUpperCase()
      router.push(`/${role.toLowerCase()}/dashboard`)
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Mobile header with background image */}
      <div className="lg:hidden relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-transparent z-10" />
        <Image
          src="/login-bg.jpg"
          alt="University of Ilorin background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-4">
          <div className="mb-6">
            <Image
              src="/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={100}
              height={100}
              className="object-contain drop-shadow-lg"
            />
          </div>
          <div className="text-white text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                UNILORIN AMS
              </span>
            </h1>
            <p className="text-lg opacity-90 font-light">
              Attendance Management System
            </p>
          </div>
        </div>
      </div>

      {/* Left side with background image (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />
        <Image
          src="/login-bg.jpg"
          alt="University of Ilorin background"
          fill
          className="object-cover scale-105 hover:scale-100 transition-transform duration-1000"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8">
          <div className="mb-12 transform hover:scale-105 transition-all duration-500">
            <Image
              src="/unilorin-logo.png"
              alt="University of Ilorin Logo"
              width={160}
              height={160}
              className="object-contain drop-shadow-2xl"
            />
          </div>
          <div className="text-white text-center space-y-6">
            <h1 className="text-6xl font-bold tracking-tight leading-tight">
              Welcome to <br />
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                UNILORIN AMS
              </span>
            </h1>
            <p className="text-2xl opacity-90 font-light tracking-wide">
              Attendance Management System
            </p>
          </div>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md shadow-2xl border-none bg-white/90 backdrop-blur-md rounded-2xl">
          <CardHeader className="space-y-3 pb-6 sm:pb-8">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sign in
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-base sm:text-lg">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="email" className="text-gray-700 text-sm sm:text-base">
                  Email, Staff ID, or Matric Number
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  required
                  placeholder="Enter your email, staff ID, or matric number"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-12 sm:h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base sm:text-lg rounded-xl transition-all duration-300"
                />
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Label htmlFor="password" className="text-gray-700 text-sm sm:text-base">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-12 sm:h-14 border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base sm:text-lg rounded-xl transition-all duration-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 sm:px-4 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center bg-red-50 p-3 sm:p-4 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 transition-all duration-500 rounded-xl shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


