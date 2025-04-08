"use client"

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { 
  Home, BookOpen, CheckCircle, Calendar, Bell, 
  Search, LogOut, Menu, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Logout failed')
      }

      // Redirect to login page
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Sidebar */}
      <aside className={cn(
        // Base styles
        "bg-gradient-to-br from-[#2E1A47] to-[#01BFFD]",
        "transition-all duration-300 ease-in-out",
        "min-h-screen",
        // Width and position styles
        "fixed left-0 top-0 bottom-0",
        "w-[68px]",
        "group hover:w-[280px]",
        isSidebarOpen && "w-[280px]",
        "z-30",
        // Shadow and border
        "shadow-lg",
        "rounded-r-2xl",
      )}>
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-white/10">
          <div className="relative w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm p-2">
            <Image
              src="/unilorin-logo.png"
              alt="University of Ilorin"
              width={48}
              height={48}
              className="transition-all duration-300 object-contain"
              priority
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {studentNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl transition-all duration-200",
                "text-white/70 hover:text-white hover:bg-white/10",
                pathname === item.href && "bg-white/20 text-white font-medium shadow-lg",
                !isSidebarOpen ? "justify-center px-3 py-3" : "px-4 py-3",
                "group-hover:justify-start group-hover:px-4",
                "backdrop-blur-sm"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 transition-all duration-300",
                !isSidebarOpen && "mx-auto"
              )} />
              <span className={cn(
                "ml-3 transition-all duration-300 whitespace-nowrap",
                !isSidebarOpen && "hidden group-hover:inline-block"
              )}>
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-white/10 p-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "w-full text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200",
              !isSidebarOpen ? "justify-center px-3 py-3" : "px-4 py-3",
              "group-hover:justify-start group-hover:px-4",
              "backdrop-blur-sm"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn(
              "h-6 w-6 transition-all duration-300",
              !isSidebarOpen && "mx-auto"
            )} />
            <span className={cn(
              "ml-3 transition-all duration-300 whitespace-nowrap",
              !isSidebarOpen && "hidden group-hover:inline-block"
            )}>
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col min-h-screen",
        "transition-all duration-300",
        "ml-[68px]",
        "group-hover:ml-[280px]",
        isSidebarOpen && "ml-[280px]",
        "w-[calc(100%-68px)]",
        "group-hover:w-[calc(100%-280px)]",
        isSidebarOpen && "w-[calc(100%-280px)]",
      )}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 h-20 border-b bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="flex items-center h-full px-4 lg:px-6 max-w-[1600px] mx-auto w-full">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 rounded-xl"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
            </Button>

            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold bg-gradient-to-r from-[#2E1A47] to-[#01BFFD] bg-clip-text text-transparent">
                  Student Portal
                </h1>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <Button variant="outline" className="hidden md:flex gap-2 rounded-xl">
                  <Search className="h-4 w-4" />
                  <span>Search...</span>
                </Button>

                <Button variant="ghost" size="icon" className="relative rounded-xl">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* Profile Section */}
                <div className="flex items-center gap-3 p-2 rounded-xl bg-white/50 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2E1A47] to-[#01BFFD] flex items-center justify-center text-white shadow-lg">
                    ST
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">CSC/2020/0001</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto w-full px-4 py-6 lg:px-8">
            <div className="rounded-2xl bg-white shadow-sm p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 