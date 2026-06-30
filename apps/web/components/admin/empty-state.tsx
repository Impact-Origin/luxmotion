import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

/**
 * The single empty-state used by every admin table — the DataTable, the
 * SubmissionsTable and the reviews grid all render this so they look identical.
 * Each caller passes its own icon + copy; the treatment (icon size, spacing,
 * colours, dashed border) is fixed here so it never drifts again.
 */
export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title: string
  description?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && <Icon className="size-8 text-muted-foreground" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
