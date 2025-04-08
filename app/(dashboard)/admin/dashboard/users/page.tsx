import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function UsersPage() {
  // Mock data for users
  const users = [
    {
      id: "1001",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "active",
      lastActive: "5 minutes ago",
    },
    {
      id: "1002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      status: "active",
      lastActive: "1 hour ago",
    },
    {
      id: "1003",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "User",
      status: "inactive",
      lastActive: "2 days ago",
    },
    {
      id: "1004",
      name: "Alice Brown",
      email: "alice.brown@example.com",
      role: "Manager",
      status: "active",
      lastActive: "30 minutes ago",
    },
    {
      id: "1005",
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      role: "User",
      status: "active",
      lastActive: "15 minutes ago",
    },
    {
      id: "1006",
      name: "Eva Wilson",
      email: "eva.wilson@example.com",
      role: "User",
      status: "active",
      lastActive: "2 hours ago",
    },
    {
      id: "1007",
      name: "Frank Miller",
      email: "frank.miller@example.com",
      role: "User",
      status: "inactive",
      lastActive: "1 week ago",
    },
    {
      id: "1008",
      name: "Grace Taylor",
      email: "grace.taylor@example.com",
      role: "Manager",
      status: "active",
      lastActive: "45 minutes ago",
    },
    {
      id: "1009",
      name: "Henry Clark",
      email: "henry.clark@example.com",
      role: "User",
      status: "active",
      lastActive: "3 hours ago",
    },
    {
      id: "1010",
      name: "Ivy Martin",
      email: "ivy.martin@example.com",
      role: "User",
      status: "active",
      lastActive: "10 minutes ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage users in your IoT attendance system</p>
        </div>
        <Link href="/dashboard/admin/users/register">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>View and manage all users in your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search users..." className="pl-8" />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.status === "active" ? (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">Inactive</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/admin/users/edit/${user.id}`}>
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

