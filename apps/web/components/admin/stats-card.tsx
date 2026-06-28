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
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[1.2px] text-muted-foreground">{title}</p>
          <div className="text-[32px] font-medium leading-none text-foreground">{value}</div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
          <Icon className="size-5" strokeWidth={1.8} />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-xs font-medium",
                trend.isPositive ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fee2e2] text-[#991b1b]",
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </span>
          )}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
      )}
    </div>
  );
}
