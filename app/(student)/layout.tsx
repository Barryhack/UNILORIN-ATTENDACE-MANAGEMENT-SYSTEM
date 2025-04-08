import { Suspense } from 'react'
import { BookOpen, Calendar, CheckCircle, Home } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import Loading from './loading'

const studentNavItems = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: Home,
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    name: "My Attendance",
    href: "/student/attendance",
    icon: CheckCircle,
  },
  {
    name: "Schedule",
    href: "/student/schedule",
    icon: Calendar,
  },
] 

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ... other code remains the same ...

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 bottom-0 left-0 z-30",
          "bg-gradient-to-br from-[#2E1A47] to-[#01BFFD]",
          "transition-all duration-300 ease-in-out",
          "lg:relative", // Changed from sticky
          "group hover:w-64",
          !isSidebarOpen ? "w-16" : "w-64",
        )}
      >
        {/* ... sidebar content ... */}
        <Image
          src="/unilorin-logo.png"
          alt="University of Ilorin"
          width={isSidebarOpen ? 52 : 32}
          height={isSidebarOpen ? 52 : 32}
          className={cn(
            "rounded-full transition-all duration-300",
            isSidebarOpen ? "w-[52px] h-[52px]" : "w-[32px] h-[32px]"
          )}
          priority
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* ... header code ... */}
        
        {/* Page Content with Suspense */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="p-4 h-full">
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
} 