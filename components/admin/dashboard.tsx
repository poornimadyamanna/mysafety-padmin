"use client"
import { useEffect } from "react";
import { DashboardCharts } from "./dashboard-charts"
import { DashboardMetrics } from "./dashboard-metrics"
import { RecentActivity } from "./recent-activity"
import { ModuleStats } from "./dashboard-module-stats"
import BannerAdmin from "./create-banner/BannerAdmin"
import { useLocation } from "@/context/location-context";

export function Dashboard() {
  const { setLocation } = useLocation();
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation(lat, lng);
      },
      (error) => {
        console.error(error.message);
      }
    );
  }, []);
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg p-8 border border-secondary/30">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300 mt-2">Welcome back! Here's your system overview.</p>
      </div>
      <BannerAdmin />
      <DashboardMetrics />
      <DashboardCharts />
      <ModuleStats />
      {/* <RecentActivity */}
    </div>
  )
}
