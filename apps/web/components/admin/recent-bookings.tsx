import { cn } from "@workspace/ui/lib/utils";

interface Booking {
  _id: string;
  customerName: string;
  pickupLocation: string;
  dropoffLocation: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
}

interface RecentBookingsProps {
  bookings: Booking[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  const statusConfig = {
    pending: { label: "Pending", color: "bg-[#fef3c7] text-[#92400e]" },
    confirmed: { label: "Confirmed", color: "bg-muted text-muted-foreground" },
    completed: { label: "Completed", color: "bg-[#dcfce7] text-[#166534]" },
    cancelled: { label: "Cancelled", color: "bg-[#fee2e2] text-[#991b1b]" },
  } as const;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</th>
            <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Route</th>
            <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
            <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm">
          {bookings.map((booking) => (
            <tr key={booking._id} className="transition-colors hover:bg-accent">
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {booking.customerName.charAt(0)}
                  </div>
                  <span className="font-medium text-foreground">{booking.customerName}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex max-w-[250px] flex-col">
                  <span className="truncate text-foreground">{booking.pickupLocation}</span>
                  <span className="truncate text-xs text-muted-foreground">{booking.dropoffLocation}</span>
                </div>
              </td>
              <td className="px-4 py-4">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
                    statusConfig[booking.status].color,
                  )}
                >
                  {statusConfig[booking.status].label}
                </span>
              </td>
              <td className="px-4 py-4 text-right">
                <span className="font-medium text-foreground">€{booking.price.toFixed(2)}</span>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={4} className="py-12 text-center text-muted-foreground">
                No recent bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
