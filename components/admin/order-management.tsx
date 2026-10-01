"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Eye, Truck, CheckCircle2, XCircle, Edit2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStats } from "./order-stats"
import { getOrderList, updateOrderStatus, getOrderDetails } from "@/lib/apicalls/orders"
import Pagination from "../pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface orderDatas {
  _id: string,
  userId: {
    name: string,
    email: string,
  },
  orderNumber: string,
  sortBy: string,
  sortOrder: string,
  search: string,
  paymentStatus: string,
  orderStatus?: string,
  moduleType: string,
  totalAmount: number,
  createdAt: string,
}
export function OrderManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [orderData, setOrderData] = useState<orderDatas[]>([])
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string>("Pending");
  const [viewOpen, setViewOpen] = useState(false);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const router = useRouter();

  const fetchOrderData = async () => {
    const response = await getOrderList({
      page,
      limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      search: searchTerm,
      paymentStatus: "",
      orderStatus: filterStatus === "all" ? undefined : filterStatus,
      moduleType: "",
    });

    if (response?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (response.success) {
      setTotalPages(response.data.pagination.totalPages)
      return response.data.data || []
    } else {
      console.error("Error fetching orders:", response.error)
      return []
    }
  }

  useEffect(() => {
    const loadOrders = async () => {
      const orders = await fetchOrderData()
      setOrderData(orders)
    }
    loadOrders()
  }, [page, searchTerm, filterStatus])

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus]);


  const statusConfig = {
    Completed: { icon: CheckCircle2, className: "bg-green-100 text-green-800" },
    Processing: { icon: Truck, className: "bg-blue-100 text-blue-800" },
    Pending: { icon: CheckCircle2, className: "bg-yellow-100 text-yellow-800" },
    Cancelled: { icon: XCircle, className: "bg-red-100 text-red-800" },
  }
  const defaultStatus = {
    className: "bg-gray-100 text-gray-800 border-gray-300"
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrderId) {
      console.error("No order selected");
      return;
    }

    const payload = {
      orderId: selectedOrderId,
      orderStatus: orderStatus,
    };

    const response = await updateOrderStatus(payload);

    if (response?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (response.success) {
      setOpen(false);
      toast.success("Order status updated successfully");
      const orders = await fetchOrderData();
      setOrderData(orders);
    } else {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", response.error);
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    const response = await getOrderDetails({ orderId });
    if (response?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (response.success) {
      setOrderDetails(response.data);
      setViewOpen(true);
    } else {
      console.error("Failed to fetch order details:", response.error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground mt-2">View and manage customer orders, shipments, and payments.</p>
      </div>

      {/* Stats */}
      <OrderStats />

      {/* Controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* update modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update order status</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Order Status</Label>

              <Select
                value={orderStatus}
                onValueChange={(val) => setOrderStatus(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 cursor-pointer">
              Cancel
            </Button>

            <Button
              onClick={handleUpdateStatus}
              className="flex-1 bg-primary hover:bg-primary/90 text-white cursor-pointer"
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* view modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>

          {!orderDetails ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-6 text-sm">

              {/* ✅ ORDER BASIC INFO */}
              <div className="grid grid-cols-2 gap-4">
                <div><b>Order Number:</b> {orderDetails.orderNumber}</div>
                <div><b>Total Amount:</b> ₹{orderDetails.totalAmount}</div>
                <div><b>Payment Status:</b> {orderDetails.paymentStatus}</div>
                <div><b>Order Status:</b> {orderDetails.orderStatus}</div>
                <div><b>Created At:</b> {new Date(orderDetails.createdAt).toLocaleString()}</div>
                <div><b>Updated At:</b> {new Date(orderDetails.updatedAt).toLocaleString()}</div>
              </div>

              {/* ✅ CUSTOMER INFO */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <div><b>Name:</b> {orderDetails.userId?.name}</div>
                <div><b>Email:</b> {orderDetails.userId?.email}</div>
              </div>

              {/* ✅ ORDER ITEMS */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Ordered Items</h3>

                {orderDetails.items?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 mb-3 space-y-2 bg-muted/40"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div><b>Module Type:</b> {item.moduleType}</div>
                      <div><b>Quantity:</b> {item.quantity}</div>
                      <div><b>Price Per Unit:</b> ₹{item.pricePerUnit}</div>
                      <div><b>Discount:</b> {item.discountPercentage}%</div>
                      <div><b>Subtotal:</b> ₹{item.subtotal}</div>
                      <div><b>Total QRs:</b> {item.qrIds?.length}</div>
                    </div>

                    {/* ✅ QR IDS LIST */}
                    <div className="mt-2">
                      <p className="font-medium mb-1">Assigned QR Codes:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                        {item?.qrIds?.map((qr: string) => (
                          <>
                            <span
                              key={qr}
                              className="bg-gray-100 text-black px-2 py-1 rounded font-mono"
                            >
                              {qr}
                            </span>
                            <QRCodeSVG value={qr} size={30} />
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ✅ FOOTER */}
              <div className="flex justify-end pt-4">
                <Button variant="outline" className="cursor-pointer" onClick={() => setViewOpen(false)}>
                  Close
                </Button>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <Tabs defaultValue="all" onValueChange={setFilterStatus} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Processing">Processing</TabsTrigger>
              <TabsTrigger value="Completed">Completed</TabsTrigger>
              <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-sm">{order?.orderNumber}</TableCell>
                    <TableCell>{order?.userId?.name || "-"}
                    </TableCell>
                    <TableCell>{order?.userId?.email || "-"}</TableCell>
                    <TableCell>{order?.totalAmount}</TableCell>
                    <TableCell>
                      <Badge
                        className={statusConfig[order?.orderStatus as keyof typeof statusConfig]?.className ?? defaultStatus.className}
                      >
                        {order?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={order?.paymentStatus === "completed" ? "default" : "secondary"}>
                        {order?.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(order?.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setViewOrderId(order?._id);
                        fetchOrderDetails(order?._id);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedOrderId(order?._id);
                        setOrderStatus(order?.orderStatus || "Pending");
                        setOpen(true);
                      }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {orderData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-6 text-gray-500">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  )
}
