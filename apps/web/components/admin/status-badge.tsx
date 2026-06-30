import { cn } from "@workspace/ui/lib/utils"

/* The one place admin status colours live. Neutral states use theme tokens; the
   semantic green/amber/red/blue are the deliberate colour exception (everything
   else in the admin is monochrome). */
const STATUS_STYLES: Record<string, string> = {
  active: "bg-[#dcfce7] text-[#166534]",
  inactive: "bg-muted text-muted-foreground",
  maintenance: "bg-[#fef3c7] text-[#92400e]",
  new: "bg-[#dbeafe] text-[#1e40af]",
  read: "bg-muted text-muted-foreground",
  archived: "bg-muted text-muted-foreground",
  pending: "bg-[#fef3c7] text-[#92400e]",
  approved: "bg-[#dcfce7] text-[#166534]",
  rejected: "bg-[#fee2e2] text-[#991b1b]",
  published: "bg-[#dcfce7] text-[#166534]",
  draft: "bg-muted text-muted-foreground",
  cancelled: "bg-[#fee2e2] text-[#991b1b]",
  completed: "bg-[#dbeafe] text-[#1e40af]",
  // Order lifecycle + payment states (used by /admin/orders)
  confirmed: "bg-[#dbeafe] text-[#1e40af]",
  paid: "bg-[#dcfce7] text-[#166534]",
  processing: "bg-[#fef3c7] text-[#92400e]",
  failed: "bg-[#fee2e2] text-[#991b1b]",
}

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: string
  label?: string
  className?: string
}) {
  const style = STATUS_STYLES[status?.toLowerCase()] ?? "bg-muted text-muted-foreground"
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize",
        style,
        className,
      )}
    >
      {label ?? status}
    </span>
  )
}
