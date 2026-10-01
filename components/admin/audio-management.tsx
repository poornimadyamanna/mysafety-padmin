"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
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
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Plus } from "lucide-react";
import { getAudioList, createAudio, updateAudio, deleteAudio } from "@/lib/apicalls/audio";
import AudioModal, { AudioFormData } from "./audio-modal";
import { toast } from "@/components/ui/use-toast";
import DeleteConfirmModal from "../ui/delete-confirmation-modal";

interface Audio {
    _id: string;
    name: string;
    code: string;
    fileName: string;
}

export default function AudioManagement() {
    const [audios, setAudios] = useState<Audio[]>([]);
    const [editingAudio, setEditingAudio] = useState<{
        _id: string;
        name: string;
        code: string;
        fileName: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [audioModalOpen, setAudioModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [audioToDelete, setAudioToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const fetchAudios = async () => {
        setLoading(true);

        const res = await getAudioList();

        if (res.unauthorized) {
            toast({
                title: "Unauthorized",
                description: "Please log in again to continue.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        if (!res.success) {
            toast({
                title: "Failed to load audios",
                description: res.error || "Something went wrong.",
                variant: "destructive",
            });
            setLoading(false);
            return;
        }

        setAudios(res.data ?? []);
        setLoading(false);
    };


    useEffect(() => {
        fetchAudios();
    }, []);



    const handleSaveAudio = async (form: AudioFormData) => {
        try {
            setSaving(true);

            let res;

            if (editingAudio) {
                // 🔵 EDIT MODE → PATCH
                const payload: {
                    audioId: string;
                    name: string;
                    code: string;
                    fileName?: string;
                } = {
                    audioId: editingAudio._id,
                    name: form.name,
                    code: form.code,
                };

                // only send fileName if user selected a new file
                if (form.file) {
                    payload.fileName = form.file.name;
                }

                res = await updateAudio(payload);
            } else {
                // 🟢 CREATE MODE → POST
                res = await createAudio({
                    name: form.name,
                    code: form.code,
                    fileName: form.file?.name ?? "",
                });
            }

            if (res.success) {
                toast({
                    title: editingAudio ? "Audio updated" : "Audio created",
                });

                setAudioModalOpen(false);
                setEditingAudio(null);
                fetchAudios();
            } else {
                toast({
                    title: "Operation failed",
                    description: res.error,
                    variant: "destructive",
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (audioId: string) => {
        setAudioToDelete(audioId);
        setDeleteModalOpen(true);
    };


    const confirmDeleteAudio = async () => {
        if (!audioToDelete) return;

        try {
            setDeleting(true);

            const res = await deleteAudio({ audioId: audioToDelete });

            if (res.unauthorized) {
                toast({
                    title: "Unauthorized",
                    description: "Please log in again to continue.",
                    variant: "destructive",
                });
                return;
            }

            if (!res.success) {
                toast({
                    title: "Failed to delete audio",
                    description: res.error || "Something went wrong.",
                    variant: "destructive",
                });
                return;
            }

            toast({ title: "Audio deleted" });
            fetchAudios();
        } finally {
            setDeleting(false);
            setAudioToDelete(null);
        }
    };



    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Audio Management</CardTitle>

                <Button onClick={() => setAudioModalOpen(true)} className="hover:bg-gray-800 cursor-pointer">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Audio
                </Button>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <p className="text-muted-foreground">Loading audios…</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Audio Name</TableHead>
                                <TableHead>File</TableHead>
                                <TableHead className="w-20" />
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {audios.map((audio) => (
                                <TableRow key={audio._id}>
                                    <TableCell>{audio.name}</TableCell>
                                    <TableCell>{audio.fileName}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditingAudio(audio);
                                                        setAudioModalOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteClick(audio._id)}
                                                >
                                                    Delete
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {!audios.length && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center">
                                        No audio files found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            <AudioModal
                open={audioModalOpen}
                initialData={
                    editingAudio
                        ? {
                            name: editingAudio.name,
                            code: editingAudio.code,
                            fileName: editingAudio.fileName,
                        }
                        : null
                }
                onClose={() => {
                    setAudioModalOpen(false);
                    setEditingAudio(null);
                }}
                onSave={handleSaveAudio}
                loading={saving}
            />

            <DeleteConfirmModal
                open={deleteModalOpen}
                onOpenChange={(open) => {
                    setDeleteModalOpen(open);
                    if (!open) setAudioToDelete(null);
                }}
                onConfirm={confirmDeleteAudio}
                loading={deleting}
                title="Delete audio"
                description="This audio will be permanently deleted. This action cannot be undone."
                destructiveLabel="Delete"
            />


        </Card>
    );
}
