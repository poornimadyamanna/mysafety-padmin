import PredefinedMessages from "@/components/admin/predefined-messages";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Vehicle Message Templates | Admin",
    description: "Manage predefined message templates for the Vehicle module",
};

export default function MessageTemplatesPage() {
    return <PredefinedMessages />;
}
