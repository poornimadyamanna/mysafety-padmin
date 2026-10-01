"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlanFeaturesModalProps {
  plan: any;
  onClose: () => void;
}

export function PlanFeaturesModal({
  plan,
  onClose,
}: PlanFeaturesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl rounded-xl bg-black text-white shadow-xl border p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              {plan.name} – {plan.price}
            </h2>
            <p className="text-sm text-muted-foreground">
              Subscription feature details
            </p>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Feature List */}
        <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          {Object.entries(plan.featuresByModule).map(
            ([module, features]: any) => (
              <div
                key={module}
                className="rounded-lg border bg-muted/40 p-4"
              >
                <div className="mb-3 text-sm font-semibold uppercase text-muted-foreground">
                  {module}
                </div>

                <ul className="space-y-2">
                  {features.map((f: string) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
