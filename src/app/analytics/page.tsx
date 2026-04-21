"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Wrench,
  AlertTriangle,
  Package,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AnalyticsData {
  totalRevenue: number;
  totalProfit: number;
  totalSalesRevenue: number;
  totalRepairRevenue: number;
  totalSalesProfit: number;
  totalRepairProfit: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  monthlySales: { month: string; revenue: number; profit: number }[];
  lowStockProducts: {
    id: string;
    name: string;
    quantity: number;
    lowStockAlert: number;
  }[];
  repairStats: {
    pending: number;
    completed: number;
    inProgress: number;
    total: number;
  };
  totalSales: number;
  totalRepairs: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <MainLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Profit",
      value: formatCurrency(data.totalProfit),
      icon: TrendingUp,
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Sales Revenue",
      value: formatCurrency(data.totalSalesRevenue),
      icon: ShoppingCart,
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Repair Revenue",
      value: formatCurrency(data.totalRepairRevenue),
      icon: Wrench,
      lightColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <MainLayout title="Analytics">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Overview of your business performance
          </p>
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
                <p className="text-xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
              Monthly Revenue & Profit
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6" }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e" }}
                  name="Profit"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
              Top Selling Products
            </h3>
            {data.topProducts.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                No sales data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Quantity Sold"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Repair Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
              Repair Statistics
            </h3>
            <div className="space-y-3">
              {[
                { label: "Total Repairs", value: data.repairStats.total, color: "bg-blue-500" },
                { label: "Completed", value: data.repairStats.completed, color: "bg-green-500" },
                { label: "In Progress", value: data.repairStats.inProgress, color: "bg-orange-500" },
                { label: "Pending", value: data.repairStats.pending, color: "bg-yellow-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Repair Profit
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(data.totalRepairProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Low Stock Alerts
              </h3>
            </div>
            {data.lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <Package className="w-10 h-10 text-green-400 mb-2" />
                <p className="text-sm text-slate-400">All products are well stocked</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Alert at: {product.lowStockAlert} units
                      </p>
                    </div>
                    <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                      {product.quantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}