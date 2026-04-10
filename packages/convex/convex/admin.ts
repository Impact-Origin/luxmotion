import { query } from "./_generated/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    const customers = await ctx.db.query("customers").collect();
    const vehicles = await ctx.db.query("vehicles").collect();
    const transactions = await ctx.db.query("transactions").withIndex("by_status", q => q.eq("status", "completed")).collect();

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const activeVehicles = vehicles.filter((vehicle) => vehicle.status === "active").length;

    return {
      totalBookings: bookings.length,
      totalRevenue,
      totalCustomers: customers.length,
      activeVehicles,
    };
  },
});

export const getRecentBookings = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db
      .query("bookings")
      .order("desc")
      .take(5);

    return Promise.all(
      bookings.map(async (booking) => {
        const customer = await ctx.db
          .query("customers")
          .filter((q) => q.eq(q.field("_id"), booking.customerId))
          .first();
        return {
          ...booking,
          customerName: customer?.name ?? "Unknown",
        };
      })
    );
  },
});

export const getBookingsByStatus = query({
  args: {},
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    const stats = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    bookings.forEach((booking) => {
      stats[booking.status]++;
    });

    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  },
});

