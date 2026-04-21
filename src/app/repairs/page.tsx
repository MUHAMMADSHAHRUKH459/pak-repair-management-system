"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import RepairTable from "@/components/repairs/RepairTable";
import RepairForm from "@/components/repairs/RepairForm";
import { Repair } from "@/types/repair";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Wrench,
  Clock,
  CheckCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadRepairs() {
      setLoading(true);
      try {
        const res = await fetch("/api/repairs");
        const data = await res.json();
        if (!cancelled) {
          setRepairs(data);
        }
      } catch (error) {
        console.error("Error fetching repairs:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRepairs();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  // Stats
  const totalRepairs = repairs.length;
  const pendingRepairs = repairs.filter((r) => r.status === "PENDING").length;
  const completedRepairs = repairs.filter(
    (r) => r.status === "COMPLETED"
  ).length;
  const totalProfit = repairs.reduce((sum, r) => sum + r.profit, 0);

  const stats = [
    {
      label: "Total Repairs",
      value: totalRepairs,
      icon: Wrench,
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Pending",
      value: pendingRepairs,
      icon: Clock,
      lightColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Completed",
      value: completedRepairs,
      icon: CheckCircle,
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <MainLayout title="Repair Management">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Repair Jobs
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage all repair entries and track profits
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" />
              New Repair
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <div
                    className={`w-9 h-9 ${stat.lightColor} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading repairs...</p>
          </div>
        ) : (
          <RepairTable repairs={repairs} onRefresh={handleRefresh} />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <RepairForm
          onClose={() => setShowForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </MainLayout>
  );
}