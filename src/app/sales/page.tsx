"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SalesTable from "@/components/sales/SalesTable";
import SalesForm from "@/components/sales/SalesForm";
import { Sale } from "@/types/sales";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  RefreshCw,
  BarChart3,
} from "lucide-react";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadSales() {
      setLoading(true);
      try {
        const res = await fetch("/api/sales");
        const data = await res.json();
        if (!cancelled) setSales(data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSales();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
  const todaySales = sales.filter((s) => {
    const today = new Date().toDateString();
    return new Date(s.createdAt).toDateString() === today;
  }).length;

  const stats = [
    {
      label: "Total Sales",
      value: totalSales,
      icon: ShoppingCart,
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Today Sales",
      value: todaySales,
      icon: BarChart3,
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      lightColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <MainLayout title="Sales">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Sales
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Track your daily sales and revenue
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
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-green-500/25"
            >
              <Plus className="w-4 h-4" />
              New Sale
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <div className={`w-9 h-9 ${stat.lightColor} rounded-lg flex items-center justify-center`}>
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
            <p className="text-sm text-slate-400">Loading sales...</p>
          </div>
        ) : (
          <SalesTable sales={sales} onRefresh={handleRefresh} />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <SalesForm
          onClose={() => setShowForm(false)}
          onSuccess={handleRefresh}
        />
      )}
    </MainLayout>
  );
}