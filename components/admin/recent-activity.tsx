"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, QrCode, User, ShoppingCart, Clock } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "safety_alert",
    title: "Vehicle Safety Alert",
    description: "User reported improper parking at Sector 12, Delhi",
    icon: AlertCircle,
    status: "urgent",
    time: "5 minutes ago",
  },
  {
    id: 2,
    type: "qr_scan",
    title: "QR Code Scanned",
    description: "Helper John Doe scanned Vehicle Safety QR - BMW X5",
    icon: QrCode,
    status: "completed",
    time: "12 minutes ago",
  },
  {
    id: 3,
    type: "new_user",
    title: "New User Registration",
    description: "Sarah Williams registered as Premium User",
    icon: User,
    status: "pending",
    time: "23 minutes ago",
  },
  {
    id: 4,
    type: "order",
    title: "Order Placed",
    description: "Customer ordered 5 Smart Cards and 10 QR code sets",
    icon: ShoppingCart,
    status: "completed",
    time: "1 hour ago",
  },
]

const statusConfig = {
  urgent: "bg-red-100 text-red-800",
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest events and interactions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{activity.title}</p>
                    <Badge variant="outline" className={statusConfig[activity.status as keyof typeof statusConfig]}>
                      {activity.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
