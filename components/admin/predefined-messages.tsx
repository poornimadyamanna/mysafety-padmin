"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import TemplateList from "./template-list";
import TemplateModal from "./template-modal";
import {
    createPredefinedMessage,
    updatePredefinedMessage,
    deletePredefinedMessage,
} from "@/lib/apicalls/predefined-messages";

export type ModuleType = "Vehicle" | "LostFound";

export interface Audio {
    _id: string;
    fileName: string;
    code: string;
    name: string;
}

export interface Template {
    _id: string;
    title: string;
    message: string;
    audioId: Audio | null;
}

export interface TemplatePayload {
    moduleType: "Vehicle" | "LostFound";
    title: string;
    message: string;
    audioId: string;
}

export default function PredefinedMessages() {
    const [activeTab, setActiveTab] = useState<ModuleType>("Vehicle");
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Template | null>(null);

    useEffect(() => {
        fetchTemplates();
    }, [activeTab]);

    const fetchTemplates = async () => {
        setLoading(true);

        const res = await fetch("/api/admin/predefinedmsg/messages/list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ moduleType: activeTab }),
        });

        const data = await res.json();
        setTemplates(data?.data || []);
        setLoading(false);
    };


    const handleSave = async (payload: {
        title: string;
        message: string;
        audioId: string;
    }) => {
        try {
            if (editing) {
                // UPDATE
                await updatePredefinedMessage({
                    messageId: editing._id,
                    title: payload.title,
                    message: payload.message,
                    audioId: payload.audioId
                });

            } else {
                // CREATE
                await createPredefinedMessage({
                    moduleType: activeTab,
                    title: payload.title,
                    message: payload.message,
                    audioId: payload.audioId
                });
            }

            setOpen(false);
            setEditing(null);

            // refetch list from backend
            fetchTemplates();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to save template");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deletePredefinedMessage(id);

            // refetch list
            fetchTemplates();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to delete template");
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Predefined Messages</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage predefined messages by module
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setEditing(null);
                        setOpen(true);
                    }}
                    className="cursor-pointer"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Message
                </Button>
            </div>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as ModuleType)}
            >
                <TabsList>
                    <TabsTrigger value="Vehicle">Vehicle</TabsTrigger>
                    <TabsTrigger value="LostFound">Lost & Found</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    <TemplateList
                        templates={templates}
                        onEdit={(template) => {
                            setEditing(template);
                            setOpen(true);
                        }}
                        onDelete={handleDelete}
                    />
                </TabsContent>
            </Tabs>

            <TemplateModal
                open={open}
                initialData={editing}
                onClose={() => setOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}
