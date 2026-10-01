"use client"

import DashboardQRUsage from "@/components/admin/dashboardqr-usage"
import TopUsersTable from "@/components/admin/top-users"

export default function QRCodesPage() {
    return (
        <div className="space-y-8">
    <DashboardQRUsage />
    <TopUsersTable />
    </div>
    )
}
