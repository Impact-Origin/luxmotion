import { LucideIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon: Icon, description, trend, className }: StatsCardProps) {
  return (
    <div className={cn(
      "relative p-6 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
          <div className="text-3xl font-bold tracking-tight text-zinc-900">{value}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      </div>
      
      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              trend.isPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-zinc-500">
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
