"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter } from "lucide-react"
import { QRTable } from "./qr-table"
import { CreateQRModal } from "./create-qr-modal"
import { QRStats } from "./qr-stats"
import { BatchFilter } from "./batch-filter"
import { BatchesTable } from "./batch-table"

export function QRCodeManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedBatch, setSelectedBatch] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">QR Code Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, manage, and track QR codes for vehicle safety, door bells, smart cards and lost & found.
        </p>
      </div>

      {/* Stats */}
      <QRStats />

      {/* Controls */}

      {/* <BatchesTable /> */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div> */}
          {/* <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button> */}
          <BatchFilter onChange={setSelectedBatch} refreshKey={refreshKey} />
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create QR Code
        </Button>
      </div>

      {/* Tabs */}
      {/* <Tabs defaultValue="all" onValueChange={setFilterStatus}>
        <TabsList>
          <TabsTrigger value="all">All QR Codes</TabsTrigger>
          <TabsTrigger value="Vehicle">Vehicle Safety</TabsTrigger>
          <TabsTrigger value="DoorBell">Door Bell</TabsTrigger>
          <TabsTrigger value="LostFound">Lost & Found</TabsTrigger>
          <TabsTrigger value="SmartCard">Smart Card</TabsTrigger>
          <TabsTrigger value="batches">View Batches</TabsTrigger>
        </TabsList>
        <TabsContent value={filterStatus} className="space-y-6">
          <QRTable searchTerm={searchTerm} filterStatus={filterStatus} batchInfo={selectedBatch} refreshKey={refreshKey} />
        </TabsContent>
      </Tabs> */}

      <Tabs defaultValue="all" onValueChange={setFilterStatus}>
        <TabsList>
          <TabsTrigger value="all">All QR Codes</TabsTrigger>
          <TabsTrigger value="Vehicle">Vehicle Safety</TabsTrigger>
          <TabsTrigger value="DoorBell">Door Bell</TabsTrigger>
          <TabsTrigger value="LostFound">Lost & Found</TabsTrigger>
          <TabsTrigger value="SmartCard">Smart Card</TabsTrigger>
          <TabsTrigger value="batches">View Batches</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <QRTable
            searchTerm={searchTerm}
            filterStatus="all"
            batchInfo={selectedBatch}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="Vehicle" className="space-y-6">
          <QRTable
            searchTerm={searchTerm}
            filterStatus="Vehicle"
            batchInfo={selectedBatch}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="DoorBell" className="space-y-6">
          <QRTable
            searchTerm={searchTerm}
            filterStatus="DoorBell"
            batchInfo={selectedBatch}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="LostFound" className="space-y-6">
          <QRTable
            searchTerm={searchTerm}
            filterStatus="LostFound"
            batchInfo={selectedBatch}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="SmartCard" className="space-y-6">
          <QRTable
            searchTerm={searchTerm}
            filterStatus="SmartCard"
            batchInfo={selectedBatch}
            refreshKey={refreshKey}
          />
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <BatchesTable batchInfo={selectedBatch} refreshKey={refreshKey} />
        </TabsContent>
      </Tabs>

      {/* Create Modal */}
      <CreateQRModal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} onSuccess={triggerRefresh} />
    </div>
  )
}
