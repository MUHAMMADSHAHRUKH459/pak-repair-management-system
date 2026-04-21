"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Wrench,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface DashboardData {
  totalRevenue: number;
  totalProfit: number;
  totalSalesRevenue: number;
  totalRepairRevenue: number;
  totalSalesProfit: number;
  totalRepairProfit: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
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

interface RecentSale {
  id: string;
  invoiceNo: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  profit: number;
  createdAt: string;
}

interface RecentRepair {
  id: string;
  customerName: string;
  deviceType: string;
  deviceModel: string;
  status: string;
  profit: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardData | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [recentRepairs, setRecentRepairs] = useState<RecentRepair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      try {
        const [analyticsRes, salesRes, repairsRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/sales"),
          fetch("/api/repairs"),
        ]);

        const [analyticsData, salesData, repairsData] = await Promise.all([
          analyticsRes.json(),
          salesRes.json(),
          repairsRes.json(),
        ]);

        if (!cancelled) {
          setAnalytics(analyticsData);
          setRecentSales(salesData.slice(0, 5));
          setRecentRepairs(repairsData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <MainLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(analytics?.totalRevenue || 0),
      icon: DollarSign,
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Profit",
      value: formatCurrency(analytics?.totalProfit || 0),
      icon: TrendingUp,
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      label: "Total Sales",
      value: analytics?.totalSales || 0,
      icon: ShoppingCart,
      lightColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Total Repairs",
      value: analytics?.totalRepairs || 0,
      icon: Wrench,
      lightColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
          <h1 className="text-xl lg:text-2xl font-bold mb-1">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-blue-100 text-sm">
            Here is your business overview for today.
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <div>
              <p className="text-blue-200 text-xs">Sales Revenue</p>
              <p className="text-white font-bold">
                {formatCurrency(analytics?.totalSalesRevenue || 0)}
              </p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Repair Revenue</p>
              <p className="text-white font-bold">
                {formatCurrency(analytics?.totalRepairRevenue || 0)}
              </p>
            </div>
            <div>
              <p className="text-blue-200 text-xs">Total Profit</p>
              <p className="text-white font-bold">
                {formatCurrency(analytics?.totalProfit || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 lg:p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <div className={`w-8 h-8 lg:w-9 lg:h-9 ${stat.lightColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${stat.textColor}`} />
                  </div>
                </div>
                <p className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Repair Stats */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
              Repair Status
            </h3>
            <div className="space-y-3">
              {[
                { label: "Pending", value: analytics?.repairStats.pending || 0, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
                { label: "In Progress", value: analytics?.repairStats.inProgress || 0, icon: Wrench, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { label: "Completed", value: analytics?.repairStats.completed || 0, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${item.bg} rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Low Stock
              </h3>
            </div>
            {analytics?.lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-center">
                <Package className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-xs text-slate-400">All products well stocked</p>
              </div>
            ) : (
              <div className="space-y-2">
                {analytics?.lowStockProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                      {product.name}
                    </p>
                    <span className="text-xs font-bold text-yellow-600 ml-2">
                      {product.quantity} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <h3 className="text-base font-semibold text-slate-800 dark:text-white mb-4">
              Top Products
            </h3>
            {analytics?.topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-28 text-center">
                <ShoppingCart className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {analytics?.topProducts.slice(0, 4).map((product, index) => (
                  <div key={product.name} className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">
                      {product.name}
                    </p>
                    <span className="text-xs text-slate-400">{product.quantity} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Recent Sales
              </h3>
              <a href="/sales" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentSales.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No sales yet</p>
                </div>
              ) : (
                recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {sale.productName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {sale.quantity} units • {formatDate(sale.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">
                        {formatCurrency(sale.totalAmount)}
                      </p>
                      <p className="text-xs text-green-500">
                        +{formatCurrency(sale.profit)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Repairs */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-800 dark:text-white">
                Recent Repairs
              </h3>
              <a href="/repairs" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </a>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentRepairs.length === 0 ? (
                <div className="p-8 text-center">
                  <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No repairs yet</p>
                </div>
              ) : (
                recentRepairs.map((repair) => (
                  <div key={repair.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">
                        {repair.customerName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {repair.deviceType} • {repair.deviceModel}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        repair.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : repair.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {repair.status === "IN_PROGRESS" ? "In Progress" : repair.status.charAt(0) + repair.status.slice(1).toLowerCase()}
                      </span>
                      <p className="text-xs text-green-500 mt-0.5">
                        +{formatCurrency(repair.profit)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}