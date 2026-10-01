"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, User, TrendingUp, UserCheck } from "lucide-react"
import { getSubscriptionStats } from "@/lib/apicalls/subscriptions"

type StatsData = {
  free: number
  premium: number
  conversionRate: string
}

export function PaymentStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await getSubscriptionStats()

      if (res?.success) {
        setStats(res.data)
      }

      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="grid grid-cols-4 gap-4">Loading...</div>
  }

  if (!stats) {
    return <p>No data available</p>
  }

  const cards = [
    {
      label: "Total Subscribers",
      value: stats.free + stats.premium,
      icon: Users,
    },
    {
      label: "Free Users",
      value: stats.free,
      icon: User,
    },
    {
      label: "Premium Subscribers",
      value: stats.premium,
      icon: UserCheck,
    },
    {
      label: "Conversion Rate",
      value: `${stats.conversionRate}%`,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
