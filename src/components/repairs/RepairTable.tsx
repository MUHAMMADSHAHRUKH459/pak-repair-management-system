"use client";

import { useState } from "react";
import { Repair, RepairStatus } from "@/types/repair";
import { formatCurrency, formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import {
  Phone,
  Smartphone,
  ChevronDown,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface RepairTableProps {
  repairs: Repair[];
  onRefresh: () => void;
}

const statusOptions: RepairStatus[] = ["PENDING", "IN_PROGRESS", "COMPLETED"];

export default function RepairTable({ repairs, onRefresh }: RepairTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: RepairStatus) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/repairs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this repair?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/repairs/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (error) {
      console.error("Error deleting repair:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (repairs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1">
          No Repairs Yet
        </h3>
        <p className="text-sm text-slate-400">
          Add your first repair entry to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Device
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Problem
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Repair Cost
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Tech Cost
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Profit
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
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
            {repairs.map((repair) => (
              <tr
                key={repair.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {/* Customer */}
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {repair.customerName}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-400">
                        {repair.contactNumber}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Device */}
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-white">
                      {repair.deviceModel}
                    </p>
                    <p className="text-xs text-slate-400">{repair.deviceType}</p>
                  </div>
                </td>

                {/* Problem */}
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 max-w-[160px] truncate">
                    {repair.problemDesc}
                  </p>
                </td>

                {/* Repair Cost */}
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {formatCurrency(repair.repairCost)}
                  </p>
                </td>

                {/* Tech Cost */}
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">
                    {formatCurrency(repair.technicianCost)}
                  </p>
                </td>

                {/* Profit */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {repair.profit >= 0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                    )}
                    <p
                      className={`text-sm font-semibold ${
                        repair.profit >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(repair.profit)}
                    </p>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="relative">
                    <select
                      value={repair.status}
                      onChange={(e) =>
                        handleStatusChange(
                          repair.id,
                          e.target.value as RepairStatus
                        )
                      }
                      disabled={updatingId === repair.id}
                      className="appearance-none pl-2 pr-6 py-1 rounded-lg text-xs font-medium bg-transparent border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 outline-none cursor-pointer hover:border-blue-400 transition-colors disabled:opacity-50"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s === "IN_PROGRESS"
                            ? "In Progress"
                            : s.charAt(0) + s.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="mt-1">
                    <StatusBadge status={repair.status} />
                  </div>
                </td>

                {/* Date */}
                <td className="px-4 py-3">
                  <p className="text-xs text-slate-400">
                    {formatDate(repair.createdAt)}
                  </p>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(repair.id)}
                    disabled={deletingId === repair.id}
                    className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}