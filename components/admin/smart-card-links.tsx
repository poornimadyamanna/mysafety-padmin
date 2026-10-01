'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, X, Pencil } from 'lucide-react';
import DeleteConfirmModal from '../ui/delete-confirmation-modal';
import CustomSnackbar from './custom-snackbar';
import { createSmartcardLink, updateSmartcardLink, deleteSmartcardLink } from '@/lib/apicalls/smartcardLinks';

interface Link {
    id: string;
    webSiteName: string;
    type: string;
    logoUrl: string;
    createdAt: number;
    updatedAt?: number;
}

interface FormData {
    webSiteName: string;
    type: string;
    logoUrl: string;
}

declare global {
    interface Window {
        storage: {
            get: (key: string) => Promise<{ key: string; value: string } | null>;
            set: (key: string, value: string) => Promise<{ key: string; value: string } | null>;
        };
    }
}

const DUMMY_LINKS: Link[] = [
    {
        id: "1",
        webSiteName: "LinkedIn",
        type: "professional",
        logoUrl: "",
        createdAt: Date.now(),
    },
    {
        id: "2",
        webSiteName: "Instagram",
        type: "social",
        logoUrl: "",
        createdAt: Date.now(),
    },
    {
        id: "3",
        webSiteName: "Personal Website",
        type: "personal",
        logoUrl: "",
        createdAt: Date.now(),
    },
    {
        id: "4",
        webSiteName: "Company Portfolio",
        type: "business",
        logoUrl: "",
        createdAt: Date.now(),
    },
]

const SmartCardLinks: React.FC = () => {
    // const [links, setLinks] = useState<Link[]>([]);
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false);
    const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        "success" | "error" | "info"
    >("info");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<any | null>(null);
    const [formData, setFormData] = useState<FormData>({
        webSiteName: '',
        type: 'social',
        logoUrl: ''
    });


    const linkTypes = ['social', 'professional', 'personal', 'business', 'other'];

    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            const result = await window.storage.get("smartcard-links")

            if (result && result.value) {
                setLinks(JSON.parse(result.value))
            } else {
                setLinks(DUMMY_LINKS)
            }
        } catch (error) {
            // console.log("Storage not found, loading dummy data")
            setLinks(DUMMY_LINKS)
        }
    }

    const saveLinks = async (updatedLinks: Link[]) => {
        try {
            await window.storage.set('smartcard-links', JSON.stringify(updatedLinks));
            setLinks(updatedLinks);
        } catch (error) {
            console.error('Error saving links:', error);
            alert('Failed to save links. Please try again.');
        }
    };


    const openModal = (link?: any) => {
        if (link) {
            setEditingLink(link);
            setFormData({
                webSiteName: link.webSiteName,
                type: link.type,
                logoUrl: link.logoUrl,
            });
            setLogoPreview(link.logoUrl || null);
        } else {
            setEditingLink(null);
            setFormData({
                webSiteName: "",
                type: "social",
                logoUrl: "",
            });

            setLogoPreview(null);
        }

        setIsModalOpen(true);
    };



    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLink(null);
        setFormData({
            webSiteName: '',
            type: 'social',
            logoUrl: ''
        });
    };

    const getTypeColor = (type: string): string => {
        const colors: Record<string, string> = {
            social: "border-blue-500/40 text-blue-400",
            professional: "border-purple-500/40 text-purple-400",
            personal: "border-green-500/40 text-green-400",
            business: "border-orange-500/40 text-orange-400",
            other: "border-muted text-muted-foreground",
        }
        return colors[type] || colors.other
    }

    const uploadLogo = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/files", {
            method: "POST",
            body: formData,
        });

        return response.json();
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!formData.webSiteName || !formData.type || !formData.logoUrl) {
            alert("Please fill in all required fields");
            return;
        }

        try {
            const savedLink = await createSmartcardLink({
                webSiteName: formData.webSiteName,
                type: formData.type,
                logoUrl: formData.logoUrl,
            });

            setLinks((prev) => [...prev, savedLink]);
            closeModal();

            setSnackbarMessage("Link created successfully");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err: any) {
            setSnackbarMessage(err.message || "Failed to create link");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleUpdate = async () => {
        if (!editingLink?._id) return;

        try {
            const updated = await updateSmartcardLink({
                linkId: editingLink._id,
                ...formData,
            });

            setLinks((prev) =>
                prev.map((link) =>
                    link._id === editingLink._id ? updated : link
                )
            );

            setIsModalOpen(false);
            setEditingLink(null);

            setSnackbarMessage("Link updated successfully");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (err: any) {
            setSnackbarMessage(err.message || "Failed to update link");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleDelete = async (linkId: string) => {
        if (!linkId) return;

        try {
            await deleteSmartcardLink(linkId);
            setLinks((prev) => prev.filter((link) => link._id !== linkId));
        } catch (err: any) {
            console.error("Delete error:", err);
            throw err;
        }
    };

    useEffect(() => {
        const fetchSmartcardLinks = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/admin/smartcardLinks", {
                    method: "GET",
                    credentials: "include",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch smartcard links");
                }

                const data = await res.json();
                setLinks(data?.data || []);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchSmartcardLinks();
    }, []);

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Smart Card Links
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your digital connections
                    </p>
                </div>

                {/* Action */}
                <div className="flex justify-end">
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-primary-foreground hover:opacity-90 cursor-pointer"
                    >
                        <Plus size={18} />
                        Add Link
                    </button>
                </div>

                {loading && (
                    <div className="rounded-lg border border-border bg-card p-6 text-center">
                        <p className="text-muted-foreground">Loading links...</p>
                    </div>
                )}

                {error && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center">
                        <p className="text-destructive">{error}</p>
                    </div>
                )}
                {/* Empty State */}
                {links.length === 0 ? (
                    <div className="rounded-lg border border-border bg-card p-12 text-center">
                        <ExternalLink className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">
                            No links added
                        </h3>
                        <p className="mt-1 text-muted-foreground">
                            Add your first SmartCard link
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="rounded-lg border border-border bg-card p-5 space-y-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="h-10 w-10 rounded-md bg-accent flex items-center justify-center text-sm font-semibold">
                                        {link.webSiteName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-medium text-foreground truncate">
                                            {link.webSiteName}
                                        </p>
                                        <span
                                            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-xs ${getTypeColor(link.type)}`}
                                        >
                                            {link.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(link)}
                                        className="flex-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedLinkId(link._id);
                                            setDeleteModalOpen(true);
                                        }}

                                        className="flex-1 rounded-md border border-destructive/40 text-destructive px-3 py-2 text-sm hover:bg-destructive/10 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 space-y-5">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-foreground">
                                    {editingLink ? "Edit Link" : "Add Link"}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Logo
                                    </label>

                                    <div className="relative w-24 h-24 mt-2">
                                        {(logoPreview || formData.logoUrl) ? (
                                            <img
                                                src={logoPreview || formData.logoUrl}
                                                alt="Logo preview"
                                                className="h-24 w-24 rounded-lg border border-border object-cover"
                                            />
                                        ) : (
                                            <div className="h-24 w-24 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                                No Logo
                                            </div>
                                        )}
                                        <label className="absolute bottom-1 right-1 rounded-full bg-background border border-border p-1.5 cursor-pointer hover:bg-accent transition">
                                            <Pencil size={14} className="text-muted-foreground" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;
                                                    setLogoPreview(URL.createObjectURL(file));
                                                    setLogoFile(file);
                                                    setUploading(true);

                                                    try {
                                                        const response = await uploadLogo(file);

                                                        if (response.success) {
                                                            const fileUrl = response.data.data.fileUrl;

                                                            setUploadedLogoUrl(fileUrl);
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                logoUrl: fileUrl,
                                                            }));
                                                        } else {
                                                            alert(response.error || "Image upload failed");
                                                        }
                                                    } catch (err) {
                                                        console.error("Upload error", err);
                                                        alert("Something went wrong while uploading");
                                                    } finally {
                                                        setUploading(false);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <input
                                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Website Name"
                                    value={formData.webSiteName}
                                    onChange={(e) =>
                                        setFormData({ ...formData, webSiteName: e.target.value })
                                    }
                                />

                                <select
                                    className="w-full rounded-md border border-border bg-background px-3 py-2"
                                    value={formData.type}
                                    onChange={(e) =>
                                        setFormData({ ...formData, type: e.target.value })
                                    }
                                >
                                    {linkTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 rounded-md border border-border px-4 py-2 hover:bg-accent cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={editingLink ? handleUpdate : handleSubmit}
                                    className="flex-1 rounded-md border border-border bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 cursor-pointer"
                                >
                                    {editingLink ? "Update" : "Add"}
                                </button>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                loading={deleting}
                onConfirm={async () => {
                    if (!selectedLinkId) return;

                    try {
                        setDeleting(true);
                        await handleDelete(selectedLinkId);
                        setSnackbarMessage("Link deleted successfully");
                        setSnackbarSeverity("success");
                        setSnackbarOpen(true);
                    } catch (err: any) {
                        setSnackbarMessage(err.message || "Failed to delete link");
                        setSnackbarSeverity("error");
                        setSnackbarOpen(true);
                    } finally {
                        setDeleting(false);
                        setSelectedLinkId(null);
                    }
                }}
            />
            <CustomSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />
        </div>

    )
};

export default SmartCardLinks;