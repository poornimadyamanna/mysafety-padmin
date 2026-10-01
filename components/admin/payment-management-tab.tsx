"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, Download } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { DialogHeader } from "../ui/dialog-modal";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";


/* ---------------- TYPES ---------------- */

type UIPaymentStatus = "completed" | "pending" | "refunded";

interface UIPayment {
    id: string;
    orderId: string;
    customer: string;
    email: string;
    amount: string;
    type: string;
    method: string;
    status: UIPaymentStatus;
    date: string;
    transactionId: string;
}

/* ---------------- COMPONENT ---------------- */

export function PaymentManagementTab() {
    const [paymentData, setPaymentData] = useState<UIPayment[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [open, setOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [filters, setFilters] = useState({
        paid: true,
        pending: true,
        failed: true,
    });


    /* ---------------- API MAPPER ---------------- */

    function mapApiPaymentToUI(payment: any): UIPayment {
        return {
            id: payment._id,
            orderId: payment.orderId?.orderNumber ?? "-",
            customer: payment.userId?.name ?? "-",
            email: payment.userId?.email ?? "-",
            amount: `₹${Number(payment.amount).toLocaleString("en-IN")}`,
            type:
                payment.transactionType === "QR_PURCHASE"
                    ? "QR Code Purchase"
                    : payment.transactionType === "DOWNLOAD_PAYMENT"
                        ? "Mixed Products"
                        : "Subscription",
            method: payment.paymentMethod ?? "-",
            status:
                payment.status === "SUCCESS"
                    ? "completed"
                    : payment.status === "PENDING"
                        ? "pending"
                        : "refunded",
            date: new Date(payment.createdAt).toISOString().split("T")[0],
            transactionId: payment.transactionId,
        };
    }

    /* ---------------- FETCH PAYMENTS ---------------- */

    useEffect(() => {
        async function fetchPayments() {
            try {
                setLoading(true);

                const res = await fetch("/api/admin/transactions/list", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        page,
                        limit,
                        search: searchTerm || "",
                        status: filterStatus === "all" ? "" : filterStatus,
                        startDate: "2025-01-01",
                        endDate: "2026-12-31",
                        sortBy: "createdAt",
                        sortOrder: "desc",
                    }),
                });

                const data = await res.json();

                const transactions = data?.data?.transactions ?? [];
                const pagination = data?.data?.pagination ?? {};

                setPaymentData(transactions.map(mapApiPaymentToUI));
                setTotalPages(pagination.totalPages ?? 1);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
                setPaymentData([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPayments();
    }, [page, searchTerm, filterStatus]);

    /* ---------------- RESET PAGE ON FILTER CHANGE ---------------- */

    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterStatus]);

    /* ---------------- VIEW TRANSACTION ---------------- */

    async function handleViewTransaction(id: string) {
        try {
            setDetailsLoading(true);
            setOpen(true);

            const res = await fetch("/api/admin/transactions/details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await res.json();
            setSelectedTransaction(data?.data?.transaction ?? null);
        } catch (error) {
            console.error("Failed to fetch transaction details", error);
            setSelectedTransaction(null);
        } finally {
            setDetailsLoading(false);
        }
    }

    /* ---------------- UI ---------------- */

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Payments</h1>
                <p className="text-muted-foreground mt-2">
                    Track payments and monitor revenue.
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>

                    {/* Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Status</DropdownMenuLabel>

                            <DropdownMenuCheckboxItem
                                checked={filters.paid}
                                onCheckedChange={(value) =>
                                    setFilters((prev) => ({ ...prev, paid: !!value }))
                                }
                            >
                                Paid
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuCheckboxItem
                                checked={filters.pending}
                                onCheckedChange={(value) =>
                                    setFilters((prev) => ({ ...prev, pending: !!value }))
                                }
                            >
                                Pending
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuCheckboxItem
                                checked={filters.failed}
                                onCheckedChange={(value) =>
                                    setFilters((prev) => ({ ...prev, failed: !!value }))
                                }
                            >
                                Failed
                            </DropdownMenuCheckboxItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() =>
                                setFilters({ paid: true, pending: true, failed: true })
                            }>
                                Reset Filters
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>


            {/* Status Filter */}
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                <TabsList>
                    <TabsTrigger value="all">All Payments</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="refunded">Refunded</TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-muted-foreground">Loading payments...</p>
                    ) : paymentData.length === 0 ? (
                        <p className="text-muted-foreground">No payments found.</p>
                    ) : (
                        <>
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
                                        {paymentData.map((payment) => (
                                            <TableRow key={payment.id}>
                                                <TableCell className="font-mono text-sm">
                                                    {payment.id}
                                                </TableCell>
                                                <TableCell>{payment.customer}</TableCell>
                                                <TableCell className="font-semibold">
                                                    {payment.amount}
                                                </TableCell>
                                                <TableCell>{payment.type}</TableCell>
                                                <TableCell>{payment.method}</TableCell>
                                                <TableCell>
                                                    <Badge>{payment.status}</Badge>
                                                </TableCell>
                                                <TableCell>{payment.date}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleViewTransaction(payment.id)
                                                        }
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            <Pagination className="mt-4">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page > 1) setPage(page - 1);
                                            }}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .slice(Math.max(0, page - 2), page + 1)
                                        .map((p) => (
                                            <PaginationItem key={p}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={page === p}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage(p);
                                                    }}
                                                >
                                                    {p}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (page < totalPages) setPage(page + 1);
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>

                    {detailsLoading ? (
                        <p className="text-muted-foreground">Loading details...</p>
                    ) : !selectedTransaction ? (
                        <p className="text-muted-foreground">No details available.</p>
                    ) : (
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="font-medium">Customer</p>
                                <p>{selectedTransaction.userId?.name}</p>
                                <p className="text-muted-foreground">
                                    {selectedTransaction.userId?.email}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="font-medium">Amount</p>
                                    <p>₹{selectedTransaction.amount}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Status</p>
                                    <Badge>{selectedTransaction.status}</Badge>
                                </div>
                            </div>

                            <div>
                                <p className="font-medium">Order Number</p>
                                <p>{selectedTransaction.orderId?.orderNumber}</p>
                            </div>

                            <div>
                                <p className="font-medium">Transaction ID</p>
                                <p className="break-all text-muted-foreground">
                                    {selectedTransaction.transactionId}
                                </p>
                            </div>

                            <div>
                                <p className="font-medium">Payment Method</p>
                                <p>{selectedTransaction.paymentMethod}</p>
                            </div>

                            <div>
                                <p className="font-medium">Date</p>
                                <p>
                                    {new Date(
                                        selectedTransaction.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
