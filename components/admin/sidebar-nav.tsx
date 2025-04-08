"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  Fingerprint,
  FileText,
  LogOut
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Student Management",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Course Management",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Device Management",
    href: "/admin/devices",
    icon: Fingerprint,
  },
  {
    title: "Attendance Records",
    href: "/admin/attendance",
    icon: FileText,
  },
  {
    title: "System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function SidebarNav() {
  return (
    <div className="flex flex-col w-64 border-r bg-background">
      <div className="flex h-16 items-center border-b px-4">
        <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
        <Separator className="my-2" />
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
} 