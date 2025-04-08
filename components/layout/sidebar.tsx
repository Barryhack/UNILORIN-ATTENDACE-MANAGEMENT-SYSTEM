"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Users,
  Settings,
  LogOut,
  Laptop,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { signOut } from "next-auth/react"

const routes = [
  {
    label: 'Overview',
    icon: BarChart,
    href: '/admin/overview',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/admin/users',
  },
  {
    label: 'Devices',
    icon: Laptop,
    href: '/admin/devices',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    console.log("Logout clicked") // Keep this debug log

    try {
      // First try to sign out using next-auth
      const result = await signOut({
        redirect: false,
      })
      
      console.log("SignOut result:", result) // Add this debug log

      // Clear storages
      localStorage.clear()
      sessionStorage.clear()
      
      // Use router for navigation
      router.push('/login')
      router.refresh()
      
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
    <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar-background text-sidebar-foreground">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">
          Admin Dashboard
        </h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition",
                pathname === route.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-center hover:bg-white/10 text-white/70 hover:text-white"
        >
          <LogOut className="h-6 w-6" />
          <span className="ml-3 hidden group-hover:inline-block">
            Logout
          </span>
        </Button>
      </div>
    </div>
  )
} 