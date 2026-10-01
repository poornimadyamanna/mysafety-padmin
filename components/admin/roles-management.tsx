"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const rolesData = [
  {
    id: "ROLE-001",
    name: "Vehicle Owner",
    description: "Can create QR codes, manage vehicles, and receive alerts",
    permissions: ["create_qr", "manage_vehicle", "receive_alerts", "subscribe_premium"],
    userCount: 4823,
  },
  {
    id: "ROLE-002",
    name: "Helper/Visitor",
    description: "Can scan QR codes and report issues",
    permissions: ["scan_qr", "report_issues"],
    userCount: 7542,
  },
  {
    id: "ROLE-003",
    name: "Driver",
    description: "Can manage vehicle and receive driver-specific alerts",
    permissions: ["receive_alerts", "manage_vehicle_assigned", "access_documents"],
    userCount: 2145,
  },
  {
    id: "ROLE-004",
    name: "Emergency Contact",
    description: "Can receive emergency notifications and respond",
    permissions: ["receive_emergency_alerts", "video_call"],
    userCount: 1987,
  },
  {
    id: "ROLE-005",
    name: "Admin",
    description: "Full system access and management",
    permissions: ["all"],
    userCount: 15,
  },
]

export function RolesManagement() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Manage user roles and their associated permissions</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rolesData.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium">{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                          {perm.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{role.userCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
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
  )
}
