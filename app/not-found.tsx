import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900">Page Not Found</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button asChild variant="default">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/login">
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

