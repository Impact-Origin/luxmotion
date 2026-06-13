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
    pending: { label: "Pending", color: "text-amber-700 bg-amber-50 border-amber-100" },
    confirmed: { label: "Confirmed", color: "text-blue-700 bg-blue-50 border-blue-100" },
    completed: { label: "Completed", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
    cancelled: { label: "Cancelled", color: "text-rose-700 bg-rose-50 border-rose-100" },
  } as const;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#efe7d8]">
            <th className="text-left py-4 px-4 text-xs font-semibold text-[#8a8074] uppercase tracking-wider">Customer</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-[#8a8074] uppercase tracking-wider">Route</th>
            <th className="text-left py-4 px-4 text-xs font-semibold text-[#8a8074] uppercase tracking-wider">Status</th>
            <th className="text-right py-4 px-4 text-xs font-semibold text-[#8a8074] uppercase tracking-wider">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#efe7d8] text-sm">
          {bookings.map((booking) => (
            <tr key={booking._id} className="hover:bg-[#A08248]/[0.06]/50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#f1e8d8] flex items-center justify-center text-xs font-bold text-[#5c554c]">
                    {booking.customerName.charAt(0)}
                  </div>
                  <span className="font-medium text-[#211c16]">{booking.customerName}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex flex-col max-w-[250px]">
                  <span className="text-[#211c16] truncate">{booking.pickupLocation}</span>
                  <span className="text-xs text-[#8a8074] truncate">{booking.dropoffLocation}</span>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-semibold",
                  statusConfig[booking.status].color
                )}>
                  {statusConfig[booking.status].label}
                </span>
              </td>
              <td className="py-4 px-4 text-right">
                <span className="font-bold text-[#211c16]">€{booking.price.toFixed(2)}</span>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={4} className="py-12 text-center text-[#8a8074]">
                No recent bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
