"use client";

import { Sale } from "@/types/sales";
import { formatCurrency, formatDate } from "@/lib/utils";
import { X, Printer, Store } from "lucide-react";

interface InvoiceModalProps {
  sale: Sale;
  onClose: () => void;
}

export default function InvoiceModal({ sale, onClose }: InvoiceModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Modal Header - Hidden on print */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 print:hidden">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Invoice
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6" id="invoice-content">
          {/* Store Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Store className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Pak Repairs
            </h1>
            <p className="text-sm text-slate-400">Management System</p>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-600 my-4" />

          {/* Invoice Details */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Invoice No:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-white">
                {sale.invoiceNo}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Date:</span>
              <span className="text-slate-800 dark:text-white">
                {formatDate(sale.createdAt)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-600 my-4" />

          {/* Product Details */}
          <div className="mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-600">
                  <th className="text-left py-2 text-slate-500 font-medium">
                    Product
                  </th>
                  <th className="text-center py-2 text-slate-500 font-medium">
                    Qty
                  </th>
                  <th className="text-right py-2 text-slate-500 font-medium">
                    Price
                  </th>
                  <th className="text-right py-2 text-slate-500 font-medium">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 text-slate-800 dark:text-white font-medium">
                    {sale.productName}
                  </td>
                  <td className="py-3 text-center text-slate-600 dark:text-slate-300">
                    {sale.quantity}
                  </td>
                  <td className="py-3 text-right text-slate-600 dark:text-slate-300">
                    {formatCurrency(sale.unitPrice)}
                  </td>
                  <td className="py-3 text-right text-slate-800 dark:text-white font-semibold">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-600 my-4" />

          {/* Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal:</span>
              <span className="text-slate-800 dark:text-white">
                {formatCurrency(sale.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax (0%):</span>
              <span className="text-slate-800 dark:text-white">
                {formatCurrency(0)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold border-t border-slate-200 dark:border-slate-600 pt-2">
              <span className="text-slate-800 dark:text-white">Total:</span>
              <span className="text-blue-600 dark:text-blue-400">
                {formatCurrency(sale.totalAmount)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-dashed border-slate-200 dark:border-slate-600 my-4" />

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-slate-500">Thank you for your business!</p>
            <p className="text-xs text-slate-400 mt-1">
              Pak Repairs Management System
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}