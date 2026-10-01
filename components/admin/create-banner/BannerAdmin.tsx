"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil, Plus } from "lucide-react";
import {
    getBanners,
    createBannerAction,
    updateBannerAction,
    deleteBannerAction,
} from "@/lib/apicalls/banner-actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


interface Banner {
    id?: string;
    image: string;
    category: "general" | "ecommerce";
    isActive: boolean;
    sortOrder: number;
}

export default function BannerAdmin() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [editing, setEditing] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [form, setForm] = useState<Banner>({
        id: "",
        image: "",
        category: "general",
        isActive: true,
        sortOrder: 1,
    });

    // ================= API =================
    const fetchBanners = async () => {
        const data = await getBanners();

        setBanners(
            data.map((item: any) => ({
                id: item._id,
                image: item.imageUrl,
                category: item.category,
                isActive: item.isActive,
                sortOrder: item.sortOrder,
            }))
        );
    };

    const handleCreateBanner = async () => {
        await createBannerAction({
            category: form.category,
            imageUrl: form.image,
            isActive: form.isActive,
            sortOrder: form.sortOrder,
        });
    };

    const handleUpdateBanner = async () => {
        if (!form.id) {
            console.error("Missing banner ID");
            return;
        }

        await updateBannerAction({
            id: form.id,
            category: form.category,
            imageUrl: form.image,
            isActive: form.isActive,
            sortOrder: form.sortOrder,
        });
    };

    // ================= EFFECT =================
    useEffect(() => {
        fetchBanners();

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, []);

    // ================= HANDLERS =================
    const handleChange = (key: keyof Banner, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (!form.image) return;

        try {
            setLoading(true);
            if (editing) {
                await handleUpdateBanner();
            } else {
                await handleCreateBanner();
            }

            await fetchBanners();
            handleClose();
        } catch (err) {
            console.error("Error saving banner", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (banner: Banner) => {
        setForm(banner);
        setEditing(true);
        setOpenForm(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) {
            console.error("Delete failed: ID missing");
            return;
        }

        await deleteBannerAction(id);
        await fetchBanners();
    };

    const handleClose = () => {
        setForm({
            id: "",
            image: "",
            category: "general",
            isActive: true,
            sortOrder: 1,
        });
        setEditing(false);
        setOpenForm(false);
    };

    const BannerPreview = ({ banner }: { banner: Banner }) => (
        <div className="relative rounded-2xl overflow-hidden group">
            <div className="h-42.5 w-full">
                {banner.image ? (
                    <img
                        src={banner.image}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-sm">
                        Upload Image
                    </div>
                )}
            </div>

            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => handleEdit(banner)}
                >
                    <Pencil size={14} />
                </Button>
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(banner.id)}
                >
                    <Trash2 size={14} />
                </Button>
            </div>
        </div>
    );

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 100 * 1024) {
            toast({
                title: "Error",
                description: "Image must be less than 100KB",
                variant: "destructive",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload/files", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || "Upload failed");
            }
            const imageUrl =
                result?.data?.data?.fileUrl;

            if (!imageUrl) {
                console.error("Invalid upload response", result);
                return;
            }

            handleChange("image", imageUrl);
            console.log("UPLOAD RESPONSE:", result);
        } catch (err) {
            console.error("Upload error:", err);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Banner Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Create and manage app banners
                    </p>
                </div>

                <Button
                    onClick={() => setOpenForm(true)}
                    className="gap-2 cursor-pointer"
                >
                    <Plus size={16} /> Add Banner
                </Button>
            </div>

            {/* GRID */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {banners.map((banner) => (
                    <Card key={banner.id} className="p-3 rounded-2xl">
                        <BannerPreview banner={banner} />
                    </Card>
                ))}

                {banners.length === 0 && (
                    <div className="col-span-full text-center text-muted-foreground">
                        No banners yet
                    </div>
                )}
            </div>

            {/* DRAWER */}
            {openForm && (
                <div
                    className="fixed inset-0 bg-black/40 flex justify-end z-50"
                    onClick={handleClose}
                >
                    <div
                        className="w-full max-w-md bg-background h-full p-6 space-y-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold">
                            {editing ? "Edit Banner" : "Create Banner"}
                        </h2>

                        {/* IMAGE */}
                        <div className="space-y-2">
                            <Label>Image</Label>
                            <Input type="file" onChange={handleImageUpload} />

                            <p className="text-red-500 text-xs">
                                * Image size should be up to 100KB
                            </p>
                        </div>

                        {/* CATEGORY */}
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={form.category}
                                onValueChange={(v) =>
                                    handleChange("category", v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">
                                        General
                                    </SelectItem>
                                    <SelectItem value="ecommerce">
                                        Ecommerce
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* STATUS */}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={form.isActive ? "active" : "inactive"}
                                onValueChange={(v) =>
                                    handleChange(
                                        "isActive",
                                        v === "active"
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">
                                        Active
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Inactive
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* PREVIEW */}
                        <div className="space-y-2">
                            <Label>Preview</Label>
                            <BannerPreview banner={form} />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2">
                            <Button
                                className="w-1/2 flex items-center justify-center gap-2 cursor-pointer"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {editing ? "Update" : "Create"}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-1/2 cursor-pointer"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}