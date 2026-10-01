"use client"

import { useEffect, useState } from "react"
import { getBatchInventory } from "@/lib/apicalls/qrcode"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Pagination from "../pagination"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface BatchItem {
  batchInfo: string
  createdAt: string
  moduleCounts: {
    Vehicle: number
    DoorBell: number
    SmartCard: number
    LostFound: number
  }
}

export function BatchesTable({ refreshKey, batchInfo }: { refreshKey: number, batchInfo: string }) {
  const [batches, setBatches] = useState<BatchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter();

  useEffect(() => {
    const fetchBatches = async () => {
      setLoading(true)

      const payload = {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: "",
        batchInfo: batchInfo || "",
      }

      const res = await getBatchInventory(payload)
      // console.log("Batch List:", res)

      // Force redirect if unauthorized
      if (res?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (res?.success) {
        setBatches(res.data.data)
        setTotalPages(res.data.pagination.totalPages)
        setTotalCount(res.data.pagination.total)
      } else {
        setBatches([])
        setTotalPages(1)
      }

      setLoading(false)
    }

    fetchBatches()
  }, [page, refreshKey, batchInfo])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          batches.map((item) => {
            const total =
              item.moduleCounts.Vehicle +
              item.moduleCounts.DoorBell +
              item.moduleCounts.SmartCard +
              item.moduleCounts.LostFound

            return (
              <Card key={item.batchInfo} className="hover:shadow-md transition">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {item.batchInfo}
                    <Badge variant="secondary">Total: {total}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    Created: {item.createdAt.split("T")[0]}
                  </p>
                </CardHeader>

                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vehicle</span>
                    <span className="font-medium">{item.moduleCounts.Vehicle}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>DoorBell</span>
                    <span className="font-medium">{item.moduleCounts.DoorBell}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>SmartCard</span>
                    <span className="font-medium">{item.moduleCounts.SmartCard}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>LostFound</span>
                    <span className="font-medium">{item.moduleCounts.LostFound}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}

        {!loading && batches.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            No batch data found
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  )
}
