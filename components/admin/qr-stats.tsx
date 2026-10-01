"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { getQrCounts } from "@/lib/apicalls/qrcode";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export function QRStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const response = await getQrCounts();

      // ✅ Force redirect if unauthorized
      if (response?.unauthorized) {
        router.push("/admin/login");
        toast.error("Session expired. Please login again.");
        return;
      }

      if (response?.success) {
        setStats(response.data);
      } else {
        console.error("QR Stats API Failed:", response?.error);
      }
    } catch (err) {
      console.error("Error fetching QR stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading stats...</p>;
  }

  const cards = [
    {
      label: "Total QR Codes",
      value: stats?.totalQRs ?? 0,
      icon: QrCode,
    },
    {
      label: "Active QR Codes",
      value: stats?.totalActiveQRs ?? 0,
      icon: TrendingUp,
    },
    {
      label: "Total Batches",
      value: stats?.totalBatches ?? 0,
      icon: Calendar,
    },
    // {
    //   label: "Unused QR Codes",
    //   value: stats?.totalUnusedQRs ?? 0,
    //   icon: Calendar,
    // },
    {
      label: "Temporary QR Codes",
      value: stats?.totalTemporaryQRs ?? 0,
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <Icon className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
