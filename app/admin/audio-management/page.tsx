import type { Metadata } from "next";
import AudioManagement from "@/components/admin/audio-management";

export const metadata: Metadata = {
    title: "Audio Management | Admin",
    description:
        "Manage audio files used for notifications, alerts, and announcements across modules.",
};

export default function AudioManagementPage() {
    return <AudioManagement />;
}
