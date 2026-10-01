"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { getUserGrowth, getRevenueGrowth } from "@/lib/apicalls/dashboard"

/* ---------- helpers ---------- */
const formatDay = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })

const formatMonth = (month: string) =>
  new Date(`${month}-01`).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  })

export function DashboardCharts() {
  const [userData, setUserData] = useState<any[]>([])
  const [revenueData, setRevenueData] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const usersRes = await getUserGrowth()
      const revenueRes = await getRevenueGrowth()

      if (usersRes?.success) {
        const mapped = usersRes.data.map((d: any) => ({
          label: formatDay(d.date),
          users: d.users,
        }))

        // 👇 prepend zero origin
        setUserData([
          { label: "0", users: 0 },
          ...mapped,
        ])
      }

      if (revenueRes?.success) {
        setRevenueData(
          revenueRes.data.map((m: any) => ({
            label: formatMonth(m.month),
            revenue: m.revenue,
            orders: m.orders,
          }))
        )
      }
    }

    load()
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ================= USER GROWTH ================= */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
          <CardDescription>New users per day</CardDescription>
        </CardHeader>

        <CardContent className="h-80">
          <ChartContainer
            config={{
              users: { label: "Users", color: "hsl(var(--primary))" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  axisLine={true}
                  tickLine={true}
                />
                <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} axisLine={true}
                  tickLine={true} />

                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#FACC15"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />

              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* ================= REVENUE GROWTH ================= */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Growth</CardTitle>
          <CardDescription>Monthly revenue & orders</CardDescription>
        </CardHeader>

        <CardContent className="h-80">
          <ChartContainer
            config={{
              revenue: { label: "Revenue", color: "hsl(var(--primary))" },
              orders: { label: "Orders", color: "hsl(var(--secondary))" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barCategoryGap={40}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />

                {/* Revenue scale */}
                <YAxis yAxisId="left" />

                {/* Orders scale */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  allowDecimals={false}
                />

                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />

                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  fill="var(--color-primary)"
                  barSize={50}
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="var(--color-secondary)"
                  barSize={25}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
