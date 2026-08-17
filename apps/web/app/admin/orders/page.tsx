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
import { TABLE_TEXT_CELL, DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";

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

function money(n: number | undefined | null) {
  if (n === undefined || n === null || Number.isNaN(n)) return undefined;
  return `€${n.toFixed(2)}`;
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      <dl className="divide-y divide-border overflow-hidden rounded-lg border border-border">
        {children}
      </dl>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === "" || value === "—") return null;
  return (
    <div className="flex items-start justify-between gap-4 px-3 py-2 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="break-words text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

/** Side sheet with every relevant field of an order — opened by clicking a table row. */
function OrderDetailSheet({ order, onClose }: { order: any | null; onClose: () => void }) {
  return (
    <Sheet open={!!order} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto p-0 sm:max-w-lg">
        {order && (
          <>
            <SheetHeader className="border-b border-border p-4">
              <SheetTitle className="flex items-center gap-2 font-mono text-sm">
                {order.orderNumber ?? "—"}
                {order.isRoundTrip && <Repeat className="size-3.5 text-muted-foreground" />}
              </SheetTitle>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <StatusBadge status={order.status} />
                <StatusBadge status={order.paymentStatus ?? "pending"} />
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </span>
              </div>
            </SheetHeader>

            <div className="flex flex-col gap-5 p-4">
              <DetailSection title="Customer">
                <DetailRow label="Name" value={order.customerName} />
                <DetailRow label="Email" value={order.customerEmail} />
                <DetailRow label="Phone" value={order.customerPhone} />
                <DetailRow label="NIF" value={order.customerNif} />
              </DetailSection>

              {order.bookedForAnotherPerson && (
                <DetailSection title="Passenger">
                  <DetailRow label="Name" value={order.passengerName} />
                  <DetailRow label="Email" value={order.passengerEmail} />
                  <DetailRow label="WhatsApp" value={order.passengerWhatsapp} />
                </DetailSection>
              )}

              <DetailSection title="Trip">
                <DetailRow label="From" value={order.departure?.location} />
                <DetailRow label="To" value={order.arrival?.location} />
                {Array.isArray(order.stops) && order.stops.length > 0 && (
                  <DetailRow
                    label="Stops"
                    value={order.stops.map((s: any) => s.location).join(" · ")}
                  />
                )}
                <DetailRow label="Date" value={formatTravel(order.departureDate)} />
                {order.isRoundTrip && (
                  <DetailRow label="Return" value={formatTravel(order.arrivalDate)} />
                )}
                <DetailRow label="Round trip" value={order.isRoundTrip ? "Yes" : "No"} />
                <DetailRow label="Passengers" value={order.passengers} />
                {(order.adults != null || order.children != null) && (
                  <DetailRow
                    label="Adults / Children"
                    value={`${order.adults ?? 0} / ${order.children ?? 0}`}
                  />
                )}
                <DetailRow label="Vehicle" value={order.vehicleName} />
                <DetailRow
                  label="Distance"
                  value={order.distance ? `${order.distance} km` : undefined}
                />
                <DetailRow
                  label="Flight"
                  value={
                    order.flightNumber
                      ? `${order.flightNumber}${order.airlineCompany ? ` · ${order.airlineCompany}` : ""}`
                      : undefined
                  }
                />
              </DetailSection>

              <DetailSection title="Payment">
                <DetailRow
                  label="Method"
                  value={
                    order.paymentMethod
                      ? (METHOD_LABEL[order.paymentMethod] ?? order.paymentMethod)
                      : undefined
                  }
                />
                <DetailRow label="Status" value={order.paymentStatus} />
                <DetailRow label="Reference" value={order.paymentRequestId} />
                <DetailRow label="MB Entity" value={order.paymentEntity} />
                <DetailRow label="MB Reference" value={order.paymentReference} />
              </DetailSection>

              <DetailSection title="Pricing">
                {/* Eventos com lugar partilhado: quem organiza precisa de saber
                    quem vai junto, e o preço sozinho não o diz. */}
                {order.sharingMode ? (
                  <DetailRow
                    label="Seat"
                    value={order.sharingMode === "shared" ? "Shared" : "Private"}
                  />
                ) : null}
                <DetailRow label="Base" value={money(order.basePrice)} />
                {order.discountAmount ? (
                  <DetailRow label="Discount" value={money(order.discountAmount)} />
                ) : null}
                {order.additionalFees ? (
                  <DetailRow label="Fees" value={money(order.additionalFees)} />
                ) : null}
                {order.nightTax ? (
                  <DetailRow label="Night tax" value={money(order.nightTax)} />
                ) : null}
                {order.airportServiceFee ? (
                  <DetailRow label="Airport fee" value={money(order.airportServiceFee)} />
                ) : null}
                <DetailRow
                  label="Total"
                  value={<span className="text-base">{money(order.totalAmount)}</span>}
                />
              </DetailSection>

              {(order.selectedCheckoutAddons?.length || order.selectedAddons?.length) ? (
                <DetailSection title="Add-ons">
                  {(order.selectedCheckoutAddons ?? []).map((a: any, i: number) => (
                    <DetailRow key={`c${i}`} label={a.label} value={money(a.price)} />
                  ))}
                  {(order.selectedAddons ?? []).map((a: any, i: number) => (
                    <DetailRow key={`a${i}`} label={`${a.title} ×${a.quantity}`} value={money(a.subtotal)} />
                  ))}
                </DetailSection>
              ) : null}

              {order.driverNotes && (
                <DetailSection title="Notes">
                  <div className="px-3 py-2 text-sm text-foreground">{order.driverNotes}</div>
                </DetailSection>
              )}

              <DetailSection title="Meta">
                <DetailRow label="Created" value={formatDateTime(order.createdAt)} />
                <DetailRow label="Updated" value={formatDateTime(order.updatedAt)} />
                <DetailRow
                  label="Order ID"
                  value={<span className="font-mono text-xs">{order._id}</span>}
                />
              </DetailSection>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
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
  const [detailOrder, setDetailOrder] = React.useState<Order | null>(null);

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
        <div className={TABLE_TEXT_CELL}>
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
        <div className={TABLE_TEXT_CELL}>
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
        <div className={TABLE_TEXT_CELL}>
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
        <div className={TABLE_TEXT_CELL}>
          <span className="font-mono text-xs font-medium text-foreground">
            {o.orderNumber ?? "—"}
          </span>
          <p className="text-xs text-muted-foreground">{formatDateTime(o.createdAt)}</p>
        </div>
        {rowActions(o)}
      </div>
      <div className={TABLE_TEXT_CELL}>
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
    <>
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
        onRowClick={setDetailOrder}
        emptyTitle="No orders found"
        emptyDescription="Orders from the checkout appear here. Adjust your search or filters."
        emptyIcon={Receipt}
      />
      <OrderDetailSheet order={detailOrder} onClose={() => setDetailOrder(null)} />
    </>
  );
}
