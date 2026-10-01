"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Eye, Send } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const notificationsLog = [
  {
    id: "NOT-001",
    type: "Vehicle Safety Alert",
    title: "Improper Parking Reported",
    recipient: "All Vehicle Owners",
    channel: "Push & SMS",
    sentDate: "2024-11-11",
    status: "sent",
    deliveryRate: "98.5%",
  },
  {
    id: "NOT-002",
    type: "Emergency Alert",
    title: "SOS Request - Nearby Users",
    recipient: "Safety Circles",
    channel: "Push & SMS",
    sentDate: "2024-11-11",
    status: "sent",
    deliveryRate: "99.2%",
  },
  {
    id: "NOT-003",
    type: "Promotion",
    title: "Premium Subscription Offer",
    recipient: "Free Users",
    channel: "Email & Push",
    sentDate: "2024-11-10",
    status: "sent",
    deliveryRate: "95.3%",
  },
  {
    id: "NOT-004",
    type: "Document Expiry",
    title: "Insurance Certificate Expiring Soon",
    recipient: "Selected Users",
    channel: "Email & SMS",
    sentDate: "2024-11-09",
    status: "sent",
    deliveryRate: "97.1%",
  },
]

export function NotificationManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotifications = notificationsLog.filter(
    (notif) =>
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-2">Send and manage push notifications, SMS, and email alerts.</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="history" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="history">Notification History</TabsTrigger>
          <TabsTrigger value="compose">Compose New</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Sent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Delivery Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notif) => (
                      <TableRow key={notif.id}>
                        <TableCell className="font-mono text-sm">{notif.id}</TableCell>
                        <TableCell>{notif.type}</TableCell>
                        <TableCell className="font-medium">{notif.title}</TableCell>
                        <TableCell>{notif.recipient}</TableCell>
                        <TableCell>{notif.channel}</TableCell>
                        <TableCell>{notif.sentDate}</TableCell>
                        <TableCell className="font-semibold text-green-600">{notif.deliveryRate}</TableCell>
                        <TableCell>
                          <Badge variant="default">{notif.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compose Tab */}
        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Notification</CardTitle>
              <CardDescription>Send alerts to users via push, email, or SMS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notification Type</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>Vehicle Safety Alert</option>
                  <option>Emergency Alert</option>
                  <option>Promotion</option>
                  <option>Document Expiry Reminder</option>
                  <option>Payment Reminder</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Notification title..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  rows={4}
                  placeholder="Notification message..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Recipients</label>
                <select className="w-full px-3 py-2 border border-border rounded-md bg-background">
                  <option>All Users</option>
                  <option>Vehicle Owners</option>
                  <option>Premium Users</option>
                  <option>Free Users</option>
                  <option>Specific Region</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Send Via</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-sm">Push Notification</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    <span className="text-sm">SMS</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">Email</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Save as Draft
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="w-4 h-4 mr-2" />
                  Send Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Notification Templates</CardTitle>
                  <CardDescription>Pre-built notification templates for common scenarios</CardDescription>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "Vehicle Safety Alert",
                    description: "Alert for parking, windows, keys, lights issues",
                  },
                  {
                    name: "Emergency SOS",
                    description: "SOS alert to emergency contacts",
                  },
                  {
                    name: "Document Expiry",
                    description: "15, 7, 3 days before expiration",
                  },
                  {
                    name: "Payment Reminder",
                    description: "Subscription renewal reminder",
                  },
                ].map((template) => (
                  <Card key={template.name}>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          Use
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
