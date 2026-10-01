"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Download } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PaymentStats } from "./payment-stats"
import { SubscriptionPlans } from "./subscription-plans"

const paymentData = [
  {
    id: "PAY-2024-001",
    orderId: "ORD-2024-001",
    customer: "John Doe",
    email: "john@example.com",
    amount: "₹1,495",
    type: "QR Code Purchase",
    method: "UPI",
    status: "completed",
    date: "2024-11-10",
    transactionId: "TXN123456789",
  },
  {
    id: "PAY-2024-002",
    orderId: "ORD-2024-002",
    customer: "Sarah Williams",
    email: "sarah@example.com",
    amount: "₹1,997",
    type: "Mixed Products",
    method: "Credit Card",
    status: "completed",
    date: "2024-11-09",
    transactionId: "TXN123456790",
  },
  {
    id: "PAY-2024-003",
    orderId: "ORD-2024-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    amount: "₹4,999",
    type: "Subscription",
    method: "Net Banking",
    status: "pending",
    date: "2024-11-11",
    transactionId: "TXN123456791",
  },
  {
    id: "PAY-2024-004",
    orderId: "ORD-2024-004",
    customer: "Emma Davis",
    email: "emma@example.com",
    amount: "₹1,990",
    type: "QR Code Purchase",
    method: "PhonePe",
    status: "completed",
    date: "2024-11-08",
    transactionId: "TXN123456792",
  },
  {
    id: "PAY-2024-005",
    orderId: "ORD-2024-005",
    customer: "David Wilson",
    email: "david@example.com",
    amount: "₹745",
    type: "QR Code Purchase",
    method: "Debit Card",
    status: "refunded",
    date: "2024-11-07",
    transactionId: "TXN123456793",
  },
]

export function PaymentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredPayments = paymentData.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === "all") return matchesSearch
    return matchesSearch && payment.status === filterStatus
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payments & Subscriptions</h1>
        <p className="text-muted-foreground mt-2">Track payments, manage subscriptions, and monitor revenue.</p>
      </div>

      {/* Stats */}
      <PaymentStats />

      {/* Tabs */}
      <Tabs defaultValue="subscriptions" className="w-full space-y-0">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscription Plans</TabsTrigger>
          <TabsTrigger value="payments">Payment Transactions</TabsTrigger>
        </TabsList>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Status Filter */}
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="refunded">Refunded</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Payments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.customer}</p>
                            <p className="text-sm text-muted-foreground">{payment.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-secondary">{payment.amount}</TableCell>
                        <TableCell>{payment.type}</TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "default"
                                : payment.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions">
          <SubscriptionPlans />
        </TabsContent>
      </Tabs>
    </div>
  )
}
