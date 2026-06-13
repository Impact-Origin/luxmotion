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

const SERIF = "var(--font-title), 'Cormorant Garamond', serif";

export function StatsCard({ title, value, icon: Icon, description, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-[#e7ddca] bg-white p-6 shadow-[0_1px_2px_rgba(33,28,22,0.04)] transition-all duration-200 hover:border-[#d8c7a3] hover:shadow-[0_10px_28px_rgba(160,130,72,0.10)]",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent"
      />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#8a8074]">{title}</p>
          <div className="text-[34px] leading-none text-[#211c16]" style={{ fontFamily: SERIF }}>
            {value}
          </div>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#e7ddca] bg-[#A08248]/[0.07] text-[#A08248]">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-semibold",
                trend.isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700",
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && <span className="text-xs text-[#8a8074]">{description}</span>}
        </div>
      )}
    </div>
  );
}
