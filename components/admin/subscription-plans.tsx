"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Plus, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getSubscriptionPlans, DeleteSubscriptionPlans } from "@/lib/apicalls/subscriptions";
import { mapPlanFromApi } from "@/lib/subscription-map";
import { PlanModal } from "./plan-modal";
import { PlanFeaturesModal } from "./view-plan-modal";

export function SubscriptionPlans() {
  const router = useRouter();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<any | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    const res = await getSubscriptionPlans();

    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired. Please login again.");
      return;
    }

    if (res?.success) {
      setPlans(res.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleDeletePlan = async (plan: any) => {
    if (!confirm(`Are you sure you want to delete this "${plan.name} plan"?`)) return;

    const res = await DeleteSubscriptionPlans(plan._id);

    if (res?.unauthorized) {
      router.push("/admin/login");
      toast.error("Session expired.");
      return;
    }

    if (!res?.success) {
      toast.error(res?.error || "Delete failed");
      return;
    }

    toast.success("Plan deleted successfully");
    loadPlans();
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        {plans.length < 2 && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={() => {
                setEditPlan(null);
                setOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Manage subscription tiers</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-10">Loading plans...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>

                {plans.map((plan) => {
                  const mapped = mapPlanFromApi(plan);

                  return (
                    <TableRow key={mapped.id}>
                      <TableCell>{mapped.name}</TableCell>
                      <TableCell>{mapped.price}</TableCell>
                      <TableCell>{mapped.billingCycle}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(mapPlanFromApi(plan))}>
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditPlan(plan);
                              setOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePlan(plan)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}

              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PlanModal
        open={open}
        editData={editPlan}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) setEditPlan(null);
        }}
        onSuccess={() => {
          setOpen(false);
          setEditPlan(null);
          loadPlans();
        }}
      />

      {selectedPlan && (
        <PlanFeaturesModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}
