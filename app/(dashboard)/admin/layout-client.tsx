"use client"

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { 
  BarChart, Users, Settings, LogOut, Laptop,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

const navItems = [
  {
    name: "Overview",
    href: "/admin/overview",
    icon: BarChart,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Devices",
    href: "/admin/devices",
    icon: Laptop,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      console.log("Logout clicked") // Debug log

      // Call the logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Clear storage
      localStorage.clear()
      sessionStorage.clear()

      // Force navigation to login
      window.location.href = '/login'
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again."
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-gradient-to-br from-[#2E1A47] to-[#01BFFD] fixed left-0 top-0 bottom-0 w-[68px] group hover:w-[280px] z-20">
        {/* Logo section */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          <Image 
            src="/unilorin-logo.png"
            alt="University of Ilorin"
            width={60}
            height={60}
            className="transition-all duration-300 w-[45px] h-[45px] group-hover:w-[55px] group-hover:h-[55px] object-contain"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-xl transition-all duration-200 text-white/70 hover:text-white hover:bg-white/10",
                "justify-center px-3 py-3 group-hover:justify-start group-hover:px-4",
                pathname === item.href && "bg-white/20 text-white font-medium"
              )}
            >
              <item.icon className="h-6 w-6 transition-all duration-300 mx-auto" />
              <span className="ml-3 transition-all duration-300 whitespace-nowrap hidden group-hover:inline-block">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="border-t border-white/10 p-4">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 justify-center px-3 py-3 group-hover:justify-start group-hover:px-4"
          >
            <LogOut className="h-6 w-6 transition-all duration-300 mx-auto" />
            <span className="ml-3 transition-all duration-300 whitespace-nowrap hidden group-hover:inline-block">
              Logout
            </span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="pl-[68px] flex-1">
        {/* Top Navigation */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
} 