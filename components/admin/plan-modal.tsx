"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  createSubscriptionPlans,
  UpdateSubscriptionPlans,
  SubscriptionUpdatePayload,
  SubscriptionFeature,
} from "@/lib/apicalls/subscriptions";
import { Badge } from "../ui/badge";


const TOGGLE_FEATURE_KEYS = ["location_tracking", "chat_media_upload"];

const isToggleFeature = (moduleType?: string, featureKey?: string) =>
  moduleType === "Vehicle" && TOGGLE_FEATURE_KEYS.includes(featureKey ?? "");

const isLinksFeature = (moduleType?: string, featureKey?: string) =>
  moduleType === "SmartCard" && featureKey === "links_available";


/* =======================
   FEATURE DEFINITIONS
======================= */
const FEATURE_KEYS_BY_MODULE: Record<
  string,
  { key: string; label: string }[]
> = {
  DoorBell: [
    { key: "family_members", label: "Family Members" },
    { key: "video_call_duration", label: "Video Call Duration" },
    { key: "audio_call_duration", label: "Audio Call Duration" },
    // { key: "predefined_messages", label: "Predefined Messages" },
  ],
  Vehicle: [
    // { key: "vehicle_count", label: "Vehicles" },
    // { key: "vehicle_tracking", label: "Vehicle Tracking" },
    { key: "video_call_duration", label: "Video Call Duration" },
    { key: "audio_call_duration", label: "Audio Call Duration" },
    { key: "location_tracking", label: "Location Tracking" },
    { key: "chat_media_upload", label: "Chat Media Upload" },
  ],
  SmartCard: [
    // { key: "card_count", label: "Smart Cards" }, 
    { key: "video_call_duration", label: "Video Call Duration" },
    { key: "audio_call_duration", label: "Audio Call Duration" },
    { key: "links_available", label: "Links Available" },
  ],
  LostFound: [
    // { key: "item_count", label: "Lost Items" },
    { key: "video_call_duration", label: "Video Call Duration" },
    { key: "audio_call_duration", label: "Audio Call Duration" },
    { key: "family_members", label: "Family Members" },
  ],
};

const MODULES = Object.keys(FEATURE_KEYS_BY_MODULE);

interface PlanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editData?: any | null;
}

export function PlanModal({
  open,
  onOpenChange,
  onSuccess,
  editData = null,
}: PlanModalProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [features, setFeatures] = useState<SubscriptionFeature[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempLinkValue, setTempLinkValue] = useState<Record<number, string>>({});


  /* =======================
     PREFILL FOR EDIT
  ======================= */
  useEffect(() => {
    if (!open) return;

    if (editData) {
      setName(editData.name || "");
      setPrice(editData.price ?? 0);

      setFeatures(
        (editData.features || []).map((f: any) => ({
          moduleType: f.moduleType ?? "",
          featureKey: f.featureKey ?? "",
          featureName: f.featureName ?? "",
          limit:
            f.links && Array.isArray(f.links)
              ? f.links
              : f.limit ?? null,
          isAvailable: f.isAvailable ?? false,
          _id: f._id,
        }))
      );
    } else {
      setName("");
      setPrice(0);
      setFeatures([
        {
          moduleType: "DoorBell",
          featureKey: "",
          featureName: "",
          limit: null,
        },
      ]);
    }
  }, [editData, open]);

  /* =======================
     HELPERS
  ======================= */
  const updateFeature = (
    index: number,
    updated: Partial<SubscriptionFeature>
  ) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated };
      return next;
    });
  };

  const addFeature = () => {
    setFeatures((prev) => [
      ...prev,
      {
        moduleType: "DoorBell",
        featureName: "",
        featureKey: "",
        limit: null,
      },
    ]);
  };

  const removeFeature = (index: number) => {
    if (features.length === 1) return;
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!name.trim()) return "Plan name is required";
    for (const f of features) {
      if (!f.moduleType || !f.featureKey || !f.featureName) {
        return "Please select module and feature for all rows";
      }
    }
    return null;
  };

  const handleSave = async () => {
    setLoading(true);

    const planId = editData?.id || editData?._id;

    const basePayload = {
      name: name.trim(),
      type: price === 0 ? "Free" : "Premium",
      price,
      currency: "INR",
      features: features.map((f: any) => ({
        moduleType: f.moduleType,
        featureName: f.featureName,
        featureKey: f.featureKey,
        limit: f.limit ?? null,
      })),
    };

    try {
      let res;

      if (editData) {
        // UPDATE
        if (!planId) {
          throw new Error("planId is required for updating a subscription");
        }

        const updatePayload: SubscriptionUpdatePayload = {
          ...basePayload,
          planId,
        };

        res = await UpdateSubscriptionPlans(updatePayload);
      } else {
        // CREATE
        res = await createSubscriptionPlans(basePayload);
      }

      if (res?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (!res?.success) {
        toast.error(res?.error || "Failed to save plan");
        return;
      }

      toast.success(
        editData ? "Plan updated successfully" : "Plan created successfully"
      );

      onSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Plan" : "Create Plan"}</DialogTitle>
          <DialogDescription>
            Configure pricing and features for subscription plans.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Plan Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Price (₹)</Label>
            <Input
              type="number"
              value={price || ""}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Plan Features</Label>
              <Button variant="outline" onClick={addFeature}>
                + Add Feature
              </Button>
            </div>

            {features?.map((f, index) => (
              <div key={index} className="relative border rounded-lg p-4">
                <div className="space-y-3">
                  {/* ROW 1*/}
                  <div
                    className={`grid gap-3 ${isLinksFeature(f.moduleType, f.featureKey)
                      ? "grid-cols-2"
                      : "grid-cols-[minmax(0,1fr)_minmax(0,2fr)_120px] items-center"
                      }`}
                  >
                    {/* 1. MODULE SELECT */}
                    <Select
                      value={f.moduleType}
                      onValueChange={(v) =>
                        updateFeature(index, {
                          moduleType: v,
                          featureKey: "",
                          featureName: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Module" />
                      </SelectTrigger>
                      <SelectContent>
                        {MODULES.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 2. FEATURE SELECT */}
                    <Select
                      value={f.featureKey}
                      onValueChange={(v) => {
                        const sel = FEATURE_KEYS_BY_MODULE[f.moduleType]?.find((x) => x.key === v);
                        if (!sel) return;
                        updateFeature(index, {
                          featureKey: sel.key,
                          featureName: sel.label,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Feature" />
                      </SelectTrigger>
                      <SelectContent>
                        {FEATURE_KEYS_BY_MODULE[f.moduleType]?.map((o) => (
                          <SelectItem key={o.key} value={o.key}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* 3. SIMPLE INPUTS */}
                    {!isLinksFeature(f.moduleType, f.featureKey) && (
                      <div>
                        {isToggleFeature(f.moduleType, f.featureKey) ? (
                          <div className="flex items-center gap-3">
                            <Label className="text-sm shrink-0">{f.limit ? "Enabled" : "Disabled"}</Label>
                            <Switch
                              checked={Boolean(f.limit)}
                              onCheckedChange={(checked) => updateFeature(index, { limit: checked ? 1 : 0 })}
                            />
                          </div>
                        ) : (
                          <Input
                            type="number"
                            value={f.limit ?? ""}
                            placeholder="Limit"
                            onChange={(e) =>
                              updateFeature(index, {
                                limit: e.target.value === "" ? null : Number(e.target.value),
                              })
                            }
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* ROW 2: SMART CARD LINKS*/}
                  {isLinksFeature(f.moduleType, f.featureKey) && (
                    <div className="space-y-3 pt-1 mt-4">
                      {/* BADGES */}
                      {/* <div className="flex flex-wrap gap-2 mb-2">
                        {(f.limit as string[] | undefined)?.map((link, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                          >
                            {link}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() =>
                                updateFeature(index, {
                                  limit: (f.limit as string[]).filter((_, idx) => idx !== i),
                                })
                              }
                            />
                          </span>
                        ))}
                      </div> */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {Array.isArray(f.limit) &&
                          f.limit.map((link, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                            >
                              {link}
                              <X
                                className="w-3 h-3 cursor-pointer hover:text-destructive"
                                onClick={() => {
                                  // Filter only if it's an array to satisfy TS in the update function
                                  const currentLinks = Array.isArray(f.limit) ? f.limit : [];
                                  updateFeature(index, {
                                    limit: currentLinks.filter((_, idx) => idx !== i),
                                  });
                                }}
                              />
                            </span>
                          ))}
                      </div>
                      {/* INPUT + ADD BUTTON */}
                      <div className="flex gap-2">
                        <Input
                          className="flex-1"
                          type="text"
                          placeholder="Enter link name (e.g. Instagram)"
                          value={tempLinkValue[index] || ""}
                          onChange={(e) =>
                            setTempLinkValue((prev) => ({ ...prev, [index]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const val = tempLinkValue[index]?.trim();
                            if (!val) return;
                            const existing = (f.limit as string[]) || [];
                            if (existing.some((l) => l.toLowerCase() === val.toLowerCase())) return;
                            updateFeature(index, { limit: [...existing, val] });
                            setTempLinkValue((prev) => ({ ...prev, [index]: "" }));
                          }}
                        >
                          + Add link
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  disabled={features.length === 1}
                  onClick={() => removeFeature(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-between pt-4">
            <div className="flex gap-3 ml-auto">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {editData ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

}
