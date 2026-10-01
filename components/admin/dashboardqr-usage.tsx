"use client"

import { useEffect, useState } from "react"
import { FileText, FileSpreadsheet } from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// import * as XLSX from "xlsx"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { getQrUsageStats } from "../../lib/apicalls/dashboard"

type QRUsage = {
    scanned: number
    expired: number
    frozen: number
}

export default function QRUsageReport() {
    const [data, setData] = useState<QRUsage | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const res = await getQrUsageStats()
            if (res?.success) setData(res.data)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return <p className="text-muted-foreground">Loading report…</p>
    if (!data) return <p className="text-red-500">Failed to load report</p>

    const total = data.scanned + data.expired + data.frozen

    const tableData = [
        { status: "Scanned", count: data.scanned },
        { status: "Expired", count: data.expired },
        { status: "Frozen", count: data.frozen },
    ].map(row => ({
        ...row,
    }))

    /* ================= EXPORTS ================= */

    // const exportExcel = () => {
    //     const ws = XLSX.utils.json_to_sheet(tableData)
    //     const wb = XLSX.utils.book_new()
    //     XLSX.utils.book_append_sheet(wb, ws, "QR Usage Report")
    //     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    //     saveAs(new Blob([excelBuffer]), "qr-usage-report.xlsx")
    // }

    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook()
        const worksheet = workbook.addWorksheet("QR Usage Report")

        worksheet.columns = [
            { header: "Status", key: "status", width: 20 },
            { header: "Count", key: "count", width: 15 },
        ]

        tableData.forEach(row => {
            worksheet.addRow(row)
        })

        // Add total row
        worksheet.addRow({
            status: "Total",
            count: total,
        })

        // Style header
        worksheet.getRow(1).font = { bold: true }

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(
            new Blob([buffer], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "qr-usage-report.xlsx"
        )
    }

    const exportPDF = () => {
        const doc = new jsPDF()
        doc.text("QR Usage Report", 14, 16)

        autoTable(doc, {
            startY: 24,
            head: [["Status", "Count"]],
            body: tableData.map(row => [
                row.status,
                row.count,
            ]),
        })

        doc.save("qr-usage-report.pdf")
    }

    /* ================= UI ================= */

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">QR Usage Report</h1>
                <p className="text-muted-foreground mt-2">
                    Summary of QR status distribution
                </p>
            </div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>QR Usage</CardTitle>
                        {/* <p className="text-sm text-muted-foreground">
            Summary of QR status distribution
          </p> */}
                    </div>

                    {/* 🔹 EXPORT BUTTONS */}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={exportPDF}>
                            <FileText className="h-4 w-4 mr-2" />
                            Export PDF
                        </Button>
                        <Button variant="outline" onClick={exportExcel}>
                            <FileSpreadsheet className="h-4 w-4 mr-2" />
                            Export Excel
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* 🔹 TABLE */}
                    <div className="overflow-x-auto">
                        <table className="w-full border border-muted rounded-lg">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Status</th>
                                    <th className="border px-4 py-2 text-right">Count</th>
                                </tr>
                            </thead>

                            <tbody>
                                {tableData.map(row => (
                                    <tr key={row.status}>
                                        <td className="border px-4 py-2">{row.status}</td>
                                        <td className="border px-4 py-2 text-right">{row.count}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot className="bg-muted/20 font-semibold">
                                <tr>
                                    <td className="border px-4 py-2">Total</td>
                                    <td className="border px-4 py-2 text-right">{total}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
