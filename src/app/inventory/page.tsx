"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import InventoryTable from "@/components/inventory/InventoryTable";
import InventoryForm from "@/components/inventory/InventoryForm";
import { Product } from "@/types/inventory";
import { formatCurrency } from "@/lib/utils";
import {
  Plus,
  Package,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Search,
} from "lucide-react";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      try {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        if (!cancelled) setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditProduct(undefined);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.quantity > 0 && p.quantity <= p.lowStockAlert
  ).length;
  const outOfStock = products.filter((p) => p.quantity === 0).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.sellingPrice * p.quantity,
    0
  );

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      lightColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Low Stock",
      value: lowStockProducts,
      icon: AlertTriangle,
      lightColor: "bg-yellow-50 dark:bg-yellow-900/20",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: AlertTriangle,
      lightColor: "bg-red-50 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400",
    },
    {
      label: "Inventory Value",
      value: formatCurrency(totalValue),
      icon: TrendingUp,
      lightColor: "bg-green-50 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <MainLayout title="Inventory">
      <div className="space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Inventory
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage your products and stock levels
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
              Add Product
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-white"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-400">Loading products...</p>
          </div>
        ) : (
          <InventoryTable
            products={filteredProducts}
            onRefresh={handleRefresh}
            onEdit={handleEdit}
          />
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <InventoryForm
          onClose={handleCloseForm}
          onSuccess={handleRefresh}
          editProduct={editProduct}
        />
      )}
    </MainLayout>
  );
}