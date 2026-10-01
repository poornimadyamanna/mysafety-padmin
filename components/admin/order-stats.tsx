"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, TrendingUp, DollarSign, Clock, AlertCircle } from "lucide-react"
import { getOrderStats } from "@/lib/apicalls/orders"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export function OrderStats() {
  const [statsData, setStatsData] = useState<any>(null);
  const router = useRouter();

  const fetchStats = async () => {
    const response = await getOrderStats()
    setStatsData(response.data)

    // ✅ Force redirect if unauthorized
    if (response?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

  }
  useEffect(() => {
    fetchStats()
  }, [])

  const stats = [
    {
      label: "Total Orders",
      value: statsData?.totalOrders ?? "0",
      icon: ShoppingCart,
    },
    {
      label: "Pending Orders",
      value: statsData?.pendingOrders ?? "0",
      icon: Clock,
    },
    {
      label: "Completed Orders",
      value: statsData?.completedOrders ?? "0",
      icon: TrendingUp,
    },
    {
      label: "Cancelled Orders",
      value: statsData?.cancelledOrders ?? "0",
      icon: AlertCircle,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
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
