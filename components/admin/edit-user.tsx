"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateUsers } from "@/lib/apicalls/users";
import { toast } from "react-hot-toast";
import { getLanguages } from "@/lib/apicalls/users";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";

interface EditUserModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: any | null;
    onUpdated: () => void;
}

export default function EditUserModal({
    open,
    onOpenChange,
    user,
    onUpdated,
}: EditUserModalProps) {
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState<any[]>([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        lang: "en",
        address: {
            fulladdress: "",
            pincode: "",
            landmark: "",
            mapUrl: "",
        },
    });
    const router = useRouter();

    // Load form data from the user object passed from parent
    useEffect(() => {
        if (!user || !open) return;

        setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            lang: user.lang || "en",
            address: {
                fulladdress: user.address?.fulladdress || "",
                pincode: user.address?.pincode || "",
                landmark: user.address?.landmark || "",
                mapUrl: user.address?.mapUrl || "",
            },
        });
    }, [user, open]);

    const handleUpdate = async () => {
        if (!user?._id) return;

        const payload = {
            userId: user._id,
            ...form,
        };

        setLoading(true);
        const res = await updateUsers(payload);
        setLoading(false);

        // Force redirect if unauthorized
        if (res?.unauthorized) {
            router.push("/admin/login");
            toast.error("Session expired. Please login again.");
            return;
        }

        if (res?.success) {
            toast.success("User updated successfully");
            onOpenChange(false);
            onUpdated();
        } else {
            toast.error(res.error || "Failed to update user");
        }
    };

    const updateField = (key: string, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateAddress = (key: string, value: any) => {
        setForm((prev) => ({
            ...prev,
            address: { ...prev.address, [key]: value },
        }));
    };

    const fetchLanguages = async () => {
        const res = await getLanguages();

        // Force redirect if unauthorized
        if (res?.unauthorized) {
            router.push("/admin/login");
            toast.error("Session expired. Please login again.");
            return;
        }

        if (res?.success) {
            setLanguages(res.data || []);
        } else {
            toast.error(res.error || "Failed to fetch languages");
            setLanguages([]);
        }
    };

    useEffect(() => {
        if (open) {
            fetchLanguages();
        }
    }, [open]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <p className="text-center py-4">Updating...</p>
                ) : (
                    <div className="space-y-6">

                        {/* Name */}
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            <Label>Language</Label>

                            <Select
                                value={form.lang}
                                onValueChange={(val) => updateField("lang", val)}
                            >
                                <SelectTrigger
                                    className="h-9 w-full rounded-md 
                                                
                                                text-white 
                                                px-3 py-1 
                                                shadow-xs 
                                                focus-visible:ring-2 
                                                focus-visible:ring-yellow-500
                                                data-[state=open]:border-yellow-500
                                                data-[state=open]:ring-2
                                                data-[state=open]:ring-yellow-500"
                                >
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>

                                <SelectContent
                                    className="bg-neutral-900 text-white border border-neutral-700"
                                >
                                    {languages.map((item) => (
                                        <SelectItem
                                            key={item._id}
                                            value={item.code}
                                            className="hover:bg-neutral-800 cursor-pointer"
                                        >
                                            {item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>



                        {/* Address Fields */}
                        <div className="space-y-2">
                            <Label>Full Address</Label>
                            <Input
                                value={form.address.fulladdress}
                                onChange={(e) => updateAddress("fulladdress", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Pincode</Label>
                            <Input
                                value={form.address.pincode}
                                onChange={(e) => updateAddress("pincode", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Landmark</Label>
                            <Input
                                value={form.address.landmark}
                                onChange={(e) => updateAddress("landmark", e.target.value)}
                            />
                        </div>

                        {/* <div className="space-y-2">
                            <Label>Map URL</Label>
                            <Input
                                value={form.address.mapUrl}
                                onChange={(e) => updateAddress("mapUrl", e.target.value)}
                            />
                        </div> */}

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                                Cancel
                            </Button>

                            <Button
                                onClick={handleUpdate}
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
