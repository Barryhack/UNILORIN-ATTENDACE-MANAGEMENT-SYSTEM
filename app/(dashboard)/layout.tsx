"use client"

import React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, TabletsIcon as Devices, Home, Settings, ChevronLeft, LogOut, CheckSquare, Book, Activity, Bell, Search, Menu, ChevronRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Add role-based navigation
const roleNavItems = {
  admin: [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
    },
    {
      name: "Devices",
      href: "/admin/devices",
      icon: Devices,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Attendance",
      href: "/admin/attendance",
      icon: CheckSquare,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],
  staff: [
    {
      name: "Dashboard",
      href: "/staff/dashboard",
      icon: Home,
    },
    {
      name: "My Classes",
      href: "/staff/classes",
      icon: Users,
    },
    {
      name: "Students",
      href: "/staff/students",
      icon: Users,
    },
    {
      name: "Schedule",
      href: "/staff/schedule",
      icon: Calendar,
    },
    {
      name: "Attendance",
      href: "/staff/attendance",
      icon: CheckSquare,
    },
    {
      name: "Reports",
      href: "/staff/reports",
      icon: Activity,
    },
  ],
  student: [
    {
      name: "Dashboard",
      href: "/student/dashboard",
      icon: Home,
    },
    {
      name: "My Courses",
      href: "/student/courses",
      icon: Book,
    },
    {
      name: "My Attendance",
      href: "/student/attendance",
      icon: CheckSquare,
    },
  ],
}

// Add this function
function getBreadcrumbs(pathname: string) {
  return pathname.split('/').filter(Boolean).map((segment) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    href: `/${segment}`
  }))
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children // This becomes just a route group wrapper
} 