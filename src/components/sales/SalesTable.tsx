"use client";

import { useState } from "react";
import { Sale } from "@/types/sales";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Trash2, ShoppingCart, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import InvoiceModal from "./InvoiceModal";

interface SalesTableProps {
  sales: Sale[];
  onRefresh: () => void;
}

export default function SalesTable({ sales, onRefresh }: SalesTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sale?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/sales/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (error) {
      console.error("Error deleting sale:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (sales.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
          No Sales Yet
        </h3>
        <p className="text-sm text-slate-400">
          Add your first sale to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Profit
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg">
                      {sale.invoiceNo}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {sale.productName}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {sale.quantity}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {formatCurrency(sale.unitPrice)}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {formatCurrency(sale.totalAmount)}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {sale.profit >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <p className={`text-sm font-semibold ${
                        sale.profit >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}>
                        {formatCurrency(sale.profit)}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="text-xs text-slate-400">
                      {formatDate(sale.createdAt)}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSale(sale)}
                        className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <Receipt className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        disabled={deletingId === sale.id}
                        className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSale && (
        <InvoiceModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </>
  );
}