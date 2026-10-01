"use client"

import { useEffect, useState } from "react"
import { getBatchInventory } from "@/lib/apicalls/qrcode"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function BatchFilter({
  onChange,
  refreshKey,
}: {
  onChange: (val: string) => void
  refreshKey: number
}) {
  const [batches, setBatches] = useState<string[]>([])
  const [selected, setSelected] = useState("")
  const router = useRouter();

  useEffect(() => {
    const fetchBatches = async () => {
      const payload = {
        page: 1,
        limit: 1000,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: "",
      }

      try {
        const res = await getBatchInventory(payload)
        // console.log("Batch list:", res)

        // Force redirect if unauthorized
        if (res?.unauthorized) {
          router.push("/admin/login");
          toast.error("Session expired. Please login again.");
          return;
        }

        if (res?.success) {
          const list = res.data.data.map((item: any) => item.batchInfo)
          setBatches(list)
        }
      } catch (err) {
        console.error("Failed to load batches", err)
      }
    }

    fetchBatches()
  }, [refreshKey])

  return (
    <div className="relative inline-flex items-center">
      <select
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value)
          onChange(e.target.value)
        }}
        className="border rounded-md px-3 py-2 bg-background text-sm"
      >
        <option value="">All Batches</option>

        {batches.map((batch) => (
          <option key={batch} value={batch}>
            {batch}
          </option>
        ))}
      </select>
    </div>
  )
}
