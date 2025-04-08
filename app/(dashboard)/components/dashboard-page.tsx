"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, TabletsIcon, Book } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-1 md:p-0">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ADMIN DASHBOARD</h1>
        <p className="text-sm md:text-base text-muted-foreground">Welcome back, Administrator</p>
      </div>

      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-2 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-xl md:text-2xl font-bold">2,350</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">+180 from last semester</p>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-2 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Active Devices</CardTitle>
            <TabletsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-xl md:text-2xl font-bold">12</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">+2 since last month</p>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-2 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Classes</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-xl md:text-2xl font-bold">48</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">Across 6 departments</p>
          </CardContent>
        </Card>
        <Card className="p-2 md:p-4">
          <CardHeader className="flex flex-row items-center justify-between p-2 md:pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Attendance Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-2">
            <div className="text-xl md:text-2xl font-bold">82%</div>
            <p className="text-[10px] md:text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-2 border rounded-lg">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Student Check-in</p>
                  <p className="text-xs text-muted-foreground">FSS-101 Lecture Hall</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">2m ago</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 