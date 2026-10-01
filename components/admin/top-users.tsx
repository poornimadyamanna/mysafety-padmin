"use client"

import { useEffect, useState } from "react"
import { QrCode } from "lucide-react"
import { getTopUsers } from "@/lib/apicalls/dashboard"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TopUser {
    _id: string
    userId: string
    name: string
    phone: string
    email: string
    qrCount: number
  }

export default function TopUsersTable() {
  const [users, setUsers] = useState<TopUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
  
      const res = await getTopUsers()
  
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data)
      } else {
        setUsers([])
      }
  
      setLoading(false)
    }
  
    fetchData()
  }, [])
  

  return (
    <Card className="bg-gradient-to-b from-[#071529] to-[#020b18] border border-white/10 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <QrCode className="w-5 h-5 text-yellow-400" />
          Top Users by QR Count
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white border-b border-white/10">
                <th className="py-3">Name</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Email</th>
                <th className="py-3 text-center">QR Count</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    Loading top users...
                  </td>
                </tr>
              )}

              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-400">
                    No data available
                  </td>
                </tr>
              )}

              {users?.map((user) => (
                <tr
                  key={user?._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="py-4 text-white font-medium">
                    {user?.name || "—"}
                  </td>

                  <td className="py-4 text-white">
                    {user?.phone}
                  </td>

                  <td className="py-4 text-white truncate max-w-[260px]">
                    {user?.email}
                  </td>

                  <td className="py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 font-semibold">
                      <QrCode className="w-4 h-4" />
                      {user?.qrCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
