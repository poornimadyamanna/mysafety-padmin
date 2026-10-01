"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Template } from "./predefined-messages";
import { Audio, getAudioList } from "@/lib/apicalls/audio";

interface Props {
    open: boolean;
    initialData: Template | null;
    onClose: () => void;
    onSave: (data: {
        title: string;
        message: string;
        audioId: string;
    }) => void;
}

export default function TemplateModal({
    open,
    initialData,
    onClose,
    onSave,
}: Props) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [audioOptions, setAudioOptions] = useState<Audio[]>([]);
    const [audioId, setAudioId] = useState("");

    const selectedAudio = audioOptions.find(
        (a) => String(a._id) === audioId
    );

    const resetForm = () => {
        setTitle("");
        setMessage("");
        setAudioId("");
    };

    /* ---------------- sync edit data ---------------- */
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setMessage(initialData.message);
            setAudioId(initialData.audioId?._id ?? "");
        } else {
            setTitle("");
            setMessage("");
            setAudioId("");
        }
    }, [initialData]);


    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);


    /* ---------------- fetch dropdown data ---------------- */
    useEffect(() => {
        const fetchAudios = async () => {
            try {
                const res = await getAudioList();

                if (res.success && res.data) {
                    setAudioOptions(res.data);
                } else {
                    setAudioOptions([]);
                }
            } catch (error) {
                console.error("Failed to fetch audio list", error);
                setAudioOptions([]);
            }
        };

        if (open) fetchAudios();
    }, [open]);


    if (!open) return null;



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="relative w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6 shadow-2xl">
                {/* Header */}
                <h3 className="text-lg font-semibold">
                    {initialData ? "Edit Message" : "Create Message"}
                </h3>

                {/* Title */}
                <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                {/* Message */}
                <textarea
                    rows={4}
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                {/* Audio Dropdown */}
                <Select value={audioId} onValueChange={setAudioId}>
                    <SelectTrigger
                        className="
                        w-full
                        items-start
                        rounded-md
                        border border-input
                        bg-background
                        px-3 py-2
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-ring
                        "
                    >
                        <span className="text-left text-muted-foreground">
                            {selectedAudio?.name ?? "Select Audio"}
                        </span>
                    </SelectTrigger>

                    <SelectContent>
                        {audioOptions.map((audio) => (
                            <SelectItem
                                key={String(audio._id)}
                                value={String(audio._id)}
                            >
                                {audio.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>


                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => {
                        resetForm();
                        onClose();
                    }}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            // console.log("Confirming audio selection:", {
                            //     audioId,
                            //     audioName: selectedAudio?.name,
                            // });
                            onSave({
                                title,
                                message,
                                audioId,
                            })
                        }

                        }
                        disabled={!title || !message || !audioId}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
