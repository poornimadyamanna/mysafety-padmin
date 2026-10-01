"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Package } from "lucide-react"
import { getInventoryStats } from "@/lib/apicalls/products"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface InventoryItem {
  qrType: string
  moduleType: string
  availableCount: number
}

export function ProductStats() {
  const [stats, setStats] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getInventoryStats()

        // ✅ Force redirect if unauthorized
        if (res?.unauthorized) {
          router.push("/admin/login");
          toast.error("Session expired. Please login again.");
          return;
        }

        if (res?.success) {
          setStats(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch inventory stats", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <p className="text-muted-foreground">Loading stats...</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => (
        <Card key={item.moduleType}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                {/* ✅ Module Name */}
                <p className="text-sm text-muted-foreground">
                  {item.moduleType}
                </p>

                {/* ✅ Available Count */}
                <p className="text-2xl font-bold text-foreground mt-1">
                  {item.availableCount}
                </p>
              </div>

              <Package className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
