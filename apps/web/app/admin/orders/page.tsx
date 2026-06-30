"use client";

import * as React from "react";
import { useQuery, useAction } from "convex/react";
import { api } from "@workspace/convex/api";
import {
  MoreVertical,
  Check,
  Repeat,
  Users,
  Receipt,
  CircleDollarSign,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "sonner";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
  type DataTableQuery,
} from "@/components/admin/data-table";

type OrderStatus = "draft" | "pending" | "confirmed" | "paid" | "completed" | "cancelled";

const ORDER_STATUSES: OrderStatus[] = [
  "draft",
  "pending",
  "confirmed",
  "paid",
  "completed",
  "cancelled",
];

const STATUS_LABEL: Record<OrderStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  confirmed: "Confirmed",
  paid: "Paid",
  completed: "Completed",
  cancelled: "Cancelled",
};

const METHOD_LABEL: Record<string, string> = {
  mbway: "MB WAY",
  mb: "Multibanco",
  ccard: "Card",
  cash: "Cash",
};

function formatDateTime(ms: number) {
  try {
    return new Date(ms).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatTravel(value: string | undefined) {
  if (!value) return "—";
  // departureDate may be a plain "YYYY-MM-DD" or a full ISO string.
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString("pt-PT", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return value;
}

export default function OrdersPage() {
  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({
    page: 0,
    pageSize: 10,
    filters: {},
  });
  const res = useQuery(api.orders.listPaged, tableQuery);
  const updateStatus = useAction(api.orders.adminUpdateOrderStatus);

  type Order = NonNullable<typeof res>["rows"][number];

  const [busyId, setBusyId] = React.useState<string | null>(null);

  const changeStatus = async (o: Order, status: OrderStatus) => {
    if (o.status === status) return;

    if (status === "paid" && o.paymentStatus !== "completed") {
      const ok = window.confirm(
        `Mark order ${o.orderNumber ?? ""} as PAID?\n\n` +
          "This fires the real payment side-effects: it records a transaction and POSTs " +
          "the order webhook (driver dispatch / confirmation e-mail). Only do this for an " +
          "order you've confirmed was actually paid.",
      );
      if (!ok) return;
    }

    setBusyId(o._id);
    try {
      const r = await updateStatus({ orderId: o._id, status });
      toast.success(
        r.triggered
          ? `Order marked as paid — payment triggers fired`
          : `Status set to ${STATUS_LABEL[status]}`,
      );
    } catch {
      toast.error("Failed to update order status");
    } finally {
      setBusyId(null);
    }
  };

  const rowActions = (o: Order) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground"
          disabled={busyId === o._id}
        >
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Set status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {ORDER_STATUSES.map((s) => (
          <DropdownMenuItem
            key={s}
            disabled={o.status === s}
            onClick={() => changeStatus(o, s)}
            className={s === "paid" ? "text-emerald-700 focus:text-emerald-700" : undefined}
          >
            {s === "paid" ? (
              <CircleDollarSign className="mr-2 size-4" />
            ) : o.status === s ? (
              <Check className="mr-2 size-4" />
            ) : (
              <span className="mr-2 size-4" />
            )}
            {STATUS_LABEL[s]}
            {o.status === s && (
              <span className="ml-auto text-[10px] uppercase text-muted-foreground">current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const columns: DataTableColumn<Order>[] = [
    {
      id: "order",
      header: "Order",
      sortAccessor: (o) => o.orderNumber ?? "",
      cell: (o) => (
        <div className="min-w-0">
          <span className="font-mono text-xs font-medium text-foreground">
            {o.orderNumber ?? "—"}
          </span>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(o.createdAt)}
            {o.partnershipName && o.partnershipName !== "Easy Transfer"
              ? ` · ${o.partnershipName}`
              : ""}
          </p>
        </div>
      ),
    },
    {
      id: "customer",
      header: "Customer",
      sortAccessor: (o) => (o.customerName ?? "").toLowerCase(),
      cell: (o) => (
        <div className="min-w-0">
          <span className="font-medium text-foreground">{o.customerName || "—"}</span>
          {o.customerEmail && (
            <p className="truncate text-xs text-muted-foreground">{o.customerEmail}</p>
          )}
        </div>
      ),
    },
    {
      id: "route",
      header: "Route",
      cell: (o) => (
        <div className="flex max-w-[260px] items-center gap-1.5">
          <span className="truncate text-sm text-foreground">{o.routeLabel}</span>
          {o.isRoundTrip && <Repeat className="size-3.5 shrink-0 text-muted-foreground" />}
        </div>
      ),
    },
    {
      id: "date",
      header: "Travel",
      sortAccessor: (o) => o.departureDate ?? "",
      cell: (o) => (
        <div className="min-w-0">
          <span className="text-sm text-foreground">{formatTravel(o.departureDate)}</span>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            {o.passengers} pax
          </p>
        </div>
      ),
    },
    {
      id: "total",
      header: "Total",
      align: "right",
      sortAccessor: (o) => o.totalAmount ?? 0,
      cell: (o) => (
        <span className="tabular-nums font-medium">€{(o.totalAmount ?? 0).toFixed(2)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (o) => <StatusBadge status={o.status} />,
    },
    {
      id: "payment",
      header: "Payment",
      cell: (o) => (
        <div className="flex flex-col items-start gap-0.5">
          <StatusBadge status={o.paymentStatus ?? "pending"} />
          {o.paymentMethod && (
            <span className="text-[11px] text-muted-foreground">
              {METHOD_LABEL[o.paymentMethod] ?? o.paymentMethod}
            </span>
          )}
        </div>
      ),
    },
  ];

  const filters: DataTableFilter<Order>[] = [
    {
      id: "status",
      label: "All status",
      width: "w-[150px]",
      options: ORDER_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] })),
    },
    {
      id: "paymentStatus",
      label: "All payments",
      width: "w-[150px]",
      options: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "completed", label: "Completed" },
        { value: "failed", label: "Failed" },
      ],
    },
    {
      id: "method",
      label: "All methods",
      width: "w-[150px]",
      options: [
        { value: "mbway", label: "MB WAY" },
        { value: "mb", label: "Multibanco" },
        { value: "ccard", label: "Card" },
        { value: "cash", label: "Cash" },
      ],
    },
  ];

  const renderCard = (o: Order) => (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="font-mono text-xs font-medium text-foreground">
            {o.orderNumber ?? "—"}
          </span>
          <p className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</p>
        </div>
        {rowActions(o)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{o.customerName || "—"}</p>
        <p className="truncate text-xs text-muted-foreground">{o.routeLabel}</p>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={o.status} />
          <StatusBadge status={o.paymentStatus ?? "pending"} />
        </div>
        <span className="tabular-nums font-medium">€{(o.totalAmount ?? 0).toFixed(2)}</span>
      </div>
    </div>
  );

  return (
    <DataTable<Order>
      mode="server"
      data={res?.rows}
      total={res?.total ?? 0}
      pageSize={10}
      onQueryChange={setTableQuery}
      columns={columns}
      searchKeys={["orderNumber", (o) => o.customerName, (o) => o.customerEmail]}
      searchPlaceholder="Search by order #, name or e-mail"
      filters={filters}
      renderCard={renderCard}
      rowActions={rowActions}
      emptyTitle="No orders found"
      emptyDescription="Orders from the checkout appear here. Adjust your search or filters."
      emptyIcon={Receipt}
    />
  );
}
