"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Copy, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { getQr } from "@/lib/apicalls/qrcode"
import Pagination from "../pagination"
import { QRCodeSVG } from "qrcode.react";
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface QRItem {
  id: string
  type: string
  code: string
  status: string
  batchInfo: string
  createdDate: string
  planAtActivation?: string
}

export function QRTable({ searchTerm, filterStatus, batchInfo, refreshKey }: { searchTerm: string; filterStatus: string; batchInfo: string, refreshKey: number; }) {
  const [qrData, setQrData] = useState<QRItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const router = useRouter();
  // ⭐ Debounced value
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value)
      }, delay)

      return () => {
        clearTimeout(handler)
      }
    }, [value, delay])

    return debouncedValue
  }

  const debouncedSearch = useDebounce(searchTerm, 600);

  const fetchQrData = async () => {
    setLoading(true)
    try {
      const payload = {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
        search: debouncedSearch,
        moduleType: filterStatus === "all" ? "" : filterStatus,
        batchInfo: batchInfo || "",
        status: "",
      }

      const response = await getQr(payload)
      // console.log("QR response...", response)

      // Force redirect if unauthorized
      if (response?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (response?.success !== false) {
        const formatted = response.data.data.map((item: any) => ({
          id: item._id,
          type: item.moduleType,
          code: item.qrId,
          status: item.status?.toLowerCase() || "inactive",
          batchInfo: item.batchInfo || "-",
          createdDate: item.createdAt?.split("T")[0] || "-",
          planAtActivation: item.planAtActivation || "-",
        }))

        setQrData(formatted)

        const total = response.data.pagination.total
        setTotalCount(total)
        setTotalPages(Math.ceil(total / limit))
      } else {
        setQrData([])
      }
    } catch (error) {
      console.error("Error load QR", error)
      setQrData([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchQrData()
  }, [page, debouncedSearch, filterStatus, batchInfo, refreshKey])

  const filteredData = qrData.filter((item) => {
    const matchesSearch =
      item?.code?.toLowerCase()?.includes(searchTerm?.toLowerCase())

    if (filterStatus === "all") return matchesSearch;

    const typeMap: Record<string, string> = {
      Vehicle: "Vehicle",
      DoorBell: "DoorBell",
      LostFound: "LostFound",
      SmartCard: "SmartCard",
    };

    const mappedType = typeMap[filterStatus];

    return matchesSearch && item.type === mappedType;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code List</CardTitle>
        <h5>Total Records : {totalCount} </h5>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>QR ID</TableHead> */}
                <TableHead>QR Code</TableHead>
                <TableHead>Module Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Plan</TableHead>
                {/* <TableHead>Actions</TableHead> */}
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  {/* <TableCell className="max-w-[150px] truncate font-mono text-sm">{item.code}</TableCell> */}
                  <TableCell>
                    <QRCodeSVG value={item.code} size={40} />
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "active" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.createdDate}</TableCell>
                  <TableCell>{item.planAtActivation}</TableCell>
                  {/* <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}

              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                    No QR codes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </CardContent>
    </Card>
  )
}
