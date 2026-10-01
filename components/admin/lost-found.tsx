'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { PackageSearch, User, Calendar } from "lucide-react";
import { getLostFoundEvents } from "@/lib/apicalls/lost-found";
import { useState, useEffect } from "react";
import Pagination from "../pagination";

function formatQrId(id?: string) {
    if (!id) return "—";
    return `...${id.slice(-8)}`;
}

function formatAddress(address?: string) {
    if (!address) return "—";
    return address.length > 40
        ? address.slice(0, 40) + "..."
        : address;
}


export default function LostFoundPage() {
    const [items, setItems] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(3);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const data = await getLostFoundEvents({
                page,
                limit,
                search: "",
                sortBy: "createdAt",
                sortOrder: "desc",
            })

            setItems(data.items);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Lost & Found Management
                </h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Lost & Found Items Log</CardTitle>
                    <CardDescription>
                        Track item status from lost to recovery
                    </CardDescription>
                    <Badge variant="outline">
                        {items.length} Records
                    </Badge>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Scanner</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Scans</TableHead>
                                <TableHead>Reported At</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {items.map((item: any) => (
                                <TableRow key={item._id}>
                                    {/* Item */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">
                                                {item.lostFoundId?.itemName}
                                            </span>
                                            <span
                                                className="text-xs text-muted-foreground"
                                                title={item.qrId?.qrId}
                                            >
                                                QR: {formatQrId(item.qrId?.qrId)}
                                            </span>

                                        </div>
                                    </TableCell>

                                    {/* Owner */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{item.ownerId?.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.ownerId?.phone}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Scanner */}
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{item.scannerId?.name || "—"}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {item.scannerType}
                                            </span>
                                        </div>
                                    </TableCell>

                                    {/* Location */}
                                    <TableCell className="max-w-xs">
                                        <span title={item.location?.address}>
                                            {formatAddress(item.location?.address)}
                                        </span>
                                    </TableCell>

                                    {/* Plan */}
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {item.qrId?.planAtActivation}
                                        </Badge>
                                    </TableCell>

                                    {/* Scan Count */}
                                    <TableCell>
                                        {item.qrId?.scanCount}
                                    </TableCell>

                                    {/* Reported At */}
                                    <TableCell>
                                        {new Date(item.createdAt).toLocaleString()}
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                item.status === "Reported"
                                                    ? "border-yellow-500 text-yellow-500"
                                                    : "border-green-500 text-green-500"
                                            }
                                        >
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {totalPages > 1 && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
