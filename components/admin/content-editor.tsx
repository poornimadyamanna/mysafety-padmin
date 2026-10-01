"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateContent } from "@/lib/apicalls/content";

type ContentByLang = Record<string, string>;
type TabType = "terms" | "privacy";

const FIELD_MAP: Record<TabType, "terms" | "privacyPolicy"> = {
    terms: "terms",
    privacy: "privacyPolicy",
};

const LANG_LABELS: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    kn: "Kannada",
    te: "Telugu",
    ta: "Tamil",
    bn: "Bengali",
};

const ContentEditor = ({
    terms,
    privacyPolicy,
}: {
    terms: ContentByLang;
    privacyPolicy: ContentByLang;
}) => {
    const [activeTab, setActiveTab] = useState<TabType>("terms");
    const [selectedLang, setSelectedLang] = useState<string>("en");

    // source of truth
    const [termsData, setTermsData] = useState<ContentByLang>(terms);
    const [privacyData, setPrivacyData] =
        useState<ContentByLang>(privacyPolicy);

    // editable draft (only for textarea)
    const [draftText, setDraftText] = useState<string>(terms.en ?? "");

    const [isEditing, setIsEditing] = useState(false);

    const currentData = activeTab === "terms" ? termsData : privacyData;
    const setCurrentData = activeTab === "terms" ? setTermsData : setPrivacyData;

    useEffect(() => {
        setIsEditing(false);
        setDraftText(currentData[selectedLang] || "");
    }, [activeTab]);


    useEffect(() => {
        if (!isEditing) {
            setDraftText(currentData[selectedLang] || "");
        }
    }, [selectedLang]);

    const handleEdit = () => {
        setDraftText(currentData[selectedLang] || "");
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraftText(currentData[selectedLang] || "");
        setIsEditing(false);
    };

    const handleSave = async () => {
        const updatedTranslations = {
            ...currentData,
            [selectedLang]: draftText,
        };

        const res = await updateContent({
            field: FIELD_MAP[activeTab],
            translations: updatedTranslations
        });

        if (!res.success) {
            alert(res.error || "Failed to update content");
            return;
        }

        setCurrentData(updatedTranslations);
        setIsEditing(false);
    };


    return (
        <div className="w-full p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Content Management</h1>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as TabType)}
                className="w-full"
            >
                <TabsList>
                    <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6 space-y-4">
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                        {/* Language Selector */}
                        <div className="w-72">
                            <Select value={selectedLang} onValueChange={setSelectedLang}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>

                                <SelectContent>
                                    {Object.keys(currentData).map((lang) => (
                                        <SelectItem key={lang} value={lang}>
                                            {LANG_LABELS[lang] ?? lang.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Edit / Save Controls */}
                        {!isEditing ? (
                            <Button variant="outline" onClick={handleEdit}>
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleCancel}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave}>Save</Button>
                            </div>
                        )}
                    </div>

                    {/* Editor */}
                    <Textarea
                        rows={12}
                        readOnly={!isEditing}
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        className={
                            !isEditing
                                ? "bg-muted cursor-not-allowed select-none"
                                : ""
                        }
                        placeholder="Enter content here..."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ContentEditor;
