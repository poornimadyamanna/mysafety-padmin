"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import {
  Users,
  QrCode,
  ShoppingCart,
  IndianRupee,
} from "lucide-react"
import { getDashboardStats } from "@/lib/apicalls/dashboard"

export function DashboardMetrics() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function loadStats() {
      const res = await getDashboardStats()

      if (res?.unauthorized) {
        router.push("/admin/login")
        return
      }

      if (!res?.success) {
        console.error(res?.error)
        return
      }

      setData(res.data)
      setLoading(false)
    }

    loadStats()
  }, [router])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 h-37.5 animate-pulse" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* USERS */}
      <StatCard
        title="Users"
        icon={Users}
        main={data.users.total}
        items={[
          { label: "Active", value: data.users.active },
          { label: "Free", value: data.users.free },
          { label: "Premium", value: data.users.premium },
        ]}
        color="bg-secondary"
      />

      {/* QRS */}
      <StatCard
        title="QR Codes"
        icon={QrCode}
        main={data.qrs.total}
        items={[
          { label: "Active", value: data.qrs.active },
          { label: "Temporary", value: data.qrs.temporary },
          { label: "Physical", value: data.qrs.physical },
        ]}
        color="bg-secondary"
      />

      {/* ORDERS */}
      <StatCard
        title="Orders"
        icon={ShoppingCart}
        main={data.orders.total}
        items={[
          { label: "Completed", value: data.orders.completed },
        ]}
        color="bg-accent"
      />

      {/* REVENUE */}
      <StatCard
        title="Revenue"
        icon={IndianRupee}
        main={`₹${data.revenue.total}`}
        items={[
          { label: "Monthly", value: `₹${data.revenue.monthly}` },
        ]}
        color="bg-chart-1"
      />
    </div>
  )
}

/* ---------------------------- */
/* Reusable Card Component */
/* ---------------------------- */

function StatCard({
  title,
  icon: Icon,
  main,
  items,
  color,
}: any) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className="text-3xl font-bold mt-2">{main}</p>
          </div>
          <div className={`${color} rounded-lg p-3`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="mt-4 space-y-1 text-sm text-muted-foreground">
          {items.map((item: any) => (
            <div
              key={item.label}
              className="flex justify-between"
            >
              <span>{item.label}</span>
              <span className="font-medium text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
