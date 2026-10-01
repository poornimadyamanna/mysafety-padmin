"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  QrCode,
  Users,
  Activity,
  Bell,
  Car,
  CreditCard,
  Package,
} from "lucide-react"
import { getModuleStats } from "../../lib/apicalls/dashboard"

const moduleConfig: Record<string, { label: string; icon: any }> = {
  DoorBell: { label: "Door Bell", icon: Bell },
  Vehicle: { label: "Vehicle", icon: Car },
  SmartCard: { label: "Smart Card", icon: CreditCard },
  LostFound: { label: "Lost & Found", icon: Package },
}

export function ModuleStats() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function fetchStats() {
      const res = await getModuleStats()
      if (res?.success) setStats(res.data)
    }
    fetchStats()
  }, [])

  if (!stats) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Overview</CardTitle>
        <CardDescription>Total QRs, Active QRs and profiles</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {Object.entries(stats).map(([key, value]: any) => {
            const Icon = moduleConfig[key]?.icon || QrCode
            const isActive = value.activeQRs > 0

            return (
              <div
                key={key}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">
                      {moduleConfig[key]?.label || key}
                    </p>

                    <Badge
                      variant="outline"
                      className={
                        isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {isActive ? "Active" : "Low Usage"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {value.totalQRs} total QRs • {value.activeQRs} active •{" "}
                    {value.totalProfiles} profiles
                  </p>

                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-3 h-3" />
                      QRs
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Usage tracked
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Profiles
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
