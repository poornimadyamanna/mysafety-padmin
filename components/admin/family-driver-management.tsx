"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/apicalls/users";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Pagination from "../pagination";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Driver {
  _id: string;
  name: string;
  phone: string;
  licenseNumber: string;
}

interface FamilyMember {
  _id: string;
  name: string;
  phone: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  isActive?: boolean;
  drivers: Driver[];
  familyMembers: FamilyMember[];
}

export default function FamilyDriverManagement({ searchTerm }: { searchTerm: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const size = 10;
  const [totalPages, setTotalPages] = useState(1)
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

  const loadUsers = async () => {
    setLoading(true);
    const res = await getAllUsers({
      page,
      size,
      sortBy: "createdAt",
      sortType: "desc",
      search: debouncedSearch,
    });

    // ✅ Force redirect if unauthorized
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
  };

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Family & Driver Management</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {loading && <p className="text-center">Loading...</p>}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="border rounded-lg p-4 space-y-4">
                {/* USER HEADER */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                  <Badge variant={user.isActive ? "secondary" : "outline"} >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                {/* ✅ DRIVERS TABLE */}
                <div>
                  <h3 className="font-medium mb-2">Drivers</h3>

                  {user.drivers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No drivers added</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>License No</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.drivers.map((driver) => (
                          <TableRow key={driver._id}>
                            <TableCell>{driver.name}</TableCell>
                            <TableCell>{driver.phone}</TableCell>
                            <TableCell>{driver.licenseNumber}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>

                {/* ✅ FAMILY MEMBERS TABLE */}
                <div>
                  <h3 className="font-medium mb-2">Family Members</h3>

                  {user.familyMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No family members added</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {user.familyMembers.map((member) => (
                          <TableRow key={member._id}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell>{member.phone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && users.length === 0 && (
          <p className="text-center text-muted-foreground">No users found</p>
        )}
      </CardContent>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </Card>
  );
}
