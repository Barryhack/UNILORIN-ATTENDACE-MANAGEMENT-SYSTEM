import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"

export default function DevicesPage() {
  // Mock data for devices
  const devices = [
    { id: "D-1", name: "Main Entrance", location: "Building A", status: "online", lastSeen: "2 minutes ago" },
    { id: "D-2", name: "Side Entrance", location: "Building A", status: "online", lastSeen: "5 minutes ago" },
    { id: "D-3", name: "Back Door", location: "Building B", status: "offline", lastSeen: "2 hours ago" },
    { id: "D-4", name: "Conference Room", location: "Building A", status: "online", lastSeen: "1 minute ago" },
    { id: "D-5", name: "Lab Entrance", location: "Building C", status: "online", lastSeen: "10 minutes ago" },
    { id: "D-6", name: "Cafeteria", location: "Building B", status: "online", lastSeen: "3 minutes ago" },
    { id: "D-7", name: "Library", location: "Building C", status: "online", lastSeen: "7 minutes ago" },
    { id: "D-8", name: "Gym", location: "Building D", status: "online", lastSeen: "15 minutes ago" },
    { id: "D-9", name: "Parking Lot", location: "Exterior", status: "online", lastSeen: "4 minutes ago" },
    { id: "D-10", name: "Admin Office", location: "Building A", status: "online", lastSeen: "1 minute ago" },
    { id: "D-11", name: "Staff Room", location: "Building B", status: "online", lastSeen: "8 minutes ago" },
    { id: "D-12", name: "Auditorium", location: "Building D", status: "online", lastSeen: "12 minutes ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Devices</h1>
          <p className="text-muted-foreground">Manage your IoT attendance devices</p>
        </div>
        <Link href="/dashboard/admin/devices/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device List</CardTitle>
          <CardDescription>View and manage all connected devices in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.id}</TableCell>
                    <TableCell>{device.name}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {device.status === "online" ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-green-600">Online</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                            <span className="text-yellow-600">Offline</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{device.lastSeen}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Link href={`/dashboard/admin/devices/verify/${device.id}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

