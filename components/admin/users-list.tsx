"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Eye, CheckCircle, Ban } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllUsers, getUserById, deactivateUsers } from "@/lib/apicalls/users";
import Pagination from "../pagination";
import EditUserModal from "./edit-user";
import ViewUserModal from "./view-user";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt: string;
  email?: string;
  isActive?: boolean;
  drivers: any[];
  familyMembers: any[];
  subscription?: {
    plan: string;
    status: string;
  };
}
export function UsersList({ searchTerm }: { searchTerm: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<any>(null);
  // Pagination
  const [page, setPage] = useState(1);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter();

  // Debounced value
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

  const loadUsers = async () => {
    setLoading(true);
    const res = await getAllUsers({
      page,
      size,
      sortBy: "createdAt",
      sortType: "desc",
      search: debouncedSearch,
    });

    // Force redirect if unauthorized
    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (res?.success) {
      setUsers(res.data?.users || []);
      const total = res.data.pagination.total
      setTotalPages(Math.ceil(total / size))
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  const handleDeactivateUser = async (userId: string, isActive: boolean) => {
    if (!userId) return;

    const newStatus = !isActive;

    const confirm = window.confirm(
      newStatus
        ? "Are you sure you want to activate this user?"
        : "Are you sure you want to deactivate this user?"
    );

    if (!confirm) return;

    const payload = {
      userId: userId,
      isActive: newStatus,
    };

    setLoading(true);
    const res = await deactivateUsers(payload);
    setLoading(false);
    // ✅ Force redirect if unauthorized
    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }
    if (res?.success === false) {
      toast.error(res.error || "Failed to update status");
      return;
    }
    toast.success(`User ${newStatus ? "activated" : "deactivated"} successfully`);
    loadUsers();
  };

  const handleModal = async (user: any, type: "edit" | "view") => {
    const res = await getUserById(user._id);
    // ✅ Force redirect if unauthorized
    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }
    if (res?.success) {
      if (type === "edit") {
        setSelectedUser(res.data);
        setIsEditOpen(true);
      } else {
        setViewUser(res.data);
        setViewOpen(true);
      }
    } else {
      alert("Failed to load user details");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Registered Users</CardTitle>
          {/* <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button> */}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Loading */}
        {loading && <p className="text-center py-4">Loading users...</p>}

        <EditUserModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          user={selectedUser}
          onUpdated={loadUsers}
        />
        <ViewUserModal
          open={viewOpen}
          onOpenChange={setViewOpen}
          user={viewUser}
        />

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found
                    </TableCell>
                  </TableRow>
                )}

                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "outline"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{user?.subscription?.plan || "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleModal(user, "view")}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleModal(user, "edit")}>
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeactivateUser(user._id, user.isActive || false)}>
                          {user.isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Ban className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      </CardContent>
    </Card>
  );
}
