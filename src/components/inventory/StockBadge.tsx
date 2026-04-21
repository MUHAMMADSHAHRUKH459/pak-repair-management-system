import { cn } from "@/lib/utils";

interface StockBadgeProps {
  quantity: number;
  lowStockAlert: number;
}

export default function StockBadge({ quantity, lowStockAlert }: StockBadgeProps) {
  const isOut = quantity === 0;
  const isLow = quantity > 0 && quantity <= lowStockAlert;
  const isGood = quantity > lowStockAlert;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        isOut && "bg-red-100 text-red-700 border-red-200",
        isLow && "bg-yellow-100 text-yellow-700 border-yellow-200",
        isGood && "bg-green-100 text-green-700 border-green-200"
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {isOut ? "Out of Stock" : isLow ? "Low Stock" : "In Stock"}
    </span>
  );
}