import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Template } from "./predefined-messages";

export default function TemplateList({
    templates,
    onEdit,
    onDelete,
}: {
    templates: Template[];
    onEdit: (t: Template) => void;
    onDelete: (id: string) => void;
}) {
    if (!templates.length) {
        return (
            <div className="border rounded-lg p-6 text-sm text-muted-foreground">
                No templates found.
            </div>
        );
    }

    return (
        <div className="border rounded-lg divide-y">
            {templates.map((t) => (
                <div
                    key={t._id}
                    className="flex items-start justify-between p-4"
                >
                    <div>
                        <h4 className="font-medium">{t.title}</h4>
                        <p className="text-sm text-muted-foreground">{t.message}</p>
                        <p className="text-sm text-muted-foreground">
                            {t.audioId?.name || "No audio attached"}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => onEdit(t)} className="cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(t._id)} className="cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
