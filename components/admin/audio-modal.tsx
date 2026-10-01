"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AudioFormData {
    name: string;
    code: string;
    file?: File;
}

interface AudioModalProps {
    open: boolean;
    initialData?: {
        name: string;
        code: string;
        fileName: string;
    } | null;
    onClose: () => void;
    onSave: (data: AudioFormData) => void;
    loading?: boolean;
}

export default function AudioModal({
    open,
    onClose,
    initialData,
    onSave,
    loading,
}: AudioModalProps) {
    const [form, setForm] = useState<AudioFormData>({
        name: "",
        code: "",
        file: undefined,
    });

    useEffect(() => {
        if (open && initialData) {
            setForm({
                name: initialData.name,
                code: initialData.code,
                file: undefined,
            });
        }

        if (open && !initialData) {
            setForm({
                name: "",
                code: "",
                file: undefined,
            });
        }
    }, [open, initialData]);


    const isDisabled =
        !form.name ||
        !form.code ||
        (!form.file && !initialData);


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md rounded-xl bg-card p-6 shadow-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Audio" : "Add Audio"}
                    </DialogTitle>

                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex flex-col space-y-1">
                        <Label>Audio Name</Label>
                        <Input
                            className="
                            bg-black
                            text-white
                            border-border
                            focus:ring-2
                            focus:ring-ring
                            focus:border-ring
                            "
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col space-y-1">
                        <Label>Code</Label>
                        <Input
                            className="
                            bg-black
                            text-white
                            border-border
                            focus:ring-2
                            focus:ring-ring
                            focus:border-ring
                          "
                            value={form.code}
                            onChange={(e) =>
                                setForm({ ...form, code: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Audio File</Label>

                        {/* Hidden real file input */}
                        <input
                            id="audio-upload"
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    file: e.target.files?.[0],
                                })
                            }
                        />

                        {/* Fake input */}
                        <label
                            htmlFor="audio-upload"
                            className="
            flex
            h-10
            w-full
            cursor-pointer
            items-center
            gap-3
            rounded-md
            border
            border-border
            bg-black
            px-3
            text-sm
            focus-within:ring-2
            focus-within:ring-ring
        "
                        >
                            {/* Choose file button */}
                            <span
                                className="
                shrink-0
                rounded
                border
                border-border
                bg-muted
                px-2
                py-1
                text-xs
                text-white
            "
                            >
                                Choose file
                            </span>

                            {/* File name */}
                            <span className="truncate text-muted-foreground">
                                {form.file
                                    ? form.file.name
                                    : initialData
                                        ? initialData.fileName
                                        : "No file chosen"}
                            </span>
                        </label>
                    </div>


                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        disabled={isDisabled || loading}
                        onClick={() => onSave(form)}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
