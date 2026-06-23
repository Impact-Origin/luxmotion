import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Refresh the cached Google reviews once a day (04:00 UTC).
crons.daily(
  "refresh google reviews",
  { hourUTC: 4, minuteUTC: 0 },
  internal.googleReviews.fetchGoogleReviews,
);

export default crons;
