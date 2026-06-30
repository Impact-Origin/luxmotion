"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { AdminSidebar } from "./sidebar";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

/* Section + page label per admin route, for the header breadcrumb. Mirrors the
   sidebar grouping. */
const ROUTE_META: Record<string, { section: string; title: string }> = {
  orders: { section: "Operations", title: "Orders" },
  vehicles: { section: "Fleet & partners", title: "Vehicles" },
  partnerships: { section: "Fleet & partners", title: "Partnerships" },
  "partner-leads": { section: "Fleet & partners", title: "Partner leads" },
  tours: { section: "Catalog", title: "Tours" },
  events: { section: "Catalog", title: "Events" },
  experiences: { section: "Catalog", title: "Experiences" },
  "corporate-experiences": { section: "Catalog", title: "Corporate experiences" },
  blogs: { section: "Catalog", title: "Blogs" },
  team: { section: "People", title: "Team" },
  drivers: { section: "People", title: "Drivers" },
  reviews: { section: "People", title: "Reviews" },
  contacts: { section: "Inbox", title: "Contacts" },
  "contact-quotes": { section: "Inbox", title: "Quote requests" },
  "tour-inquiries": { section: "Inbox", title: "Ultra-luxury inquiries" },
  "wedding-quotes": { section: "Inbox", title: "Wedding quotes" },
  "school-quotes": { section: "Inbox", title: "School quotes" },
  "corporate-requests": { section: "Inbox", title: "Corporate requests" },
  "partner-applications": { section: "Applications", title: "Partner applications" },
  "driver-applications": { section: "Applications", title: "Driver applications" },
  numbers: { section: "Settings", title: "Numbers" },
  availability: { section: "Settings", title: "Availability" },
  newsletter: { section: "Settings", title: "Newsletter" },
};

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  // Radix portals (popovers, dropdowns, selects) mount on document.body — outside
  // the .admin-theme <div> — so they'd miss the admin tokens and paint with a
  // transparent / wrong background. Scope the theme on <body> while in the admin.
  React.useEffect(() => {
    document.body.classList.add("admin-theme");
    return () => document.body.classList.remove("admin-theme");
  }, []);

  // The sign-in route is public and gets its own full-screen layout — no shell.
  if (pathname?.startsWith("/admin/sign-in")) {
    return <>{children}</>;
  }

  const seg = pathname?.split("/")[2] ?? "";
  const meta = ROUTE_META[seg];
  const section = meta?.section ?? "Admin";
  const title =
    meta?.title ?? (seg ? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ") : "Dashboard");

  return (
    <GoogleMapsProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground antialiased">
        <AdminSidebar collapsed={collapsed} />

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/85 px-4 backdrop-blur lg:px-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="size-9 shrink-0 text-muted-foreground"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
              </Button>
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium text-muted-foreground">{section}</span>
                <h1 className="text-[17px] font-medium leading-none text-foreground">{title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[1.3px] text-muted-foreground">
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
              <span suppressHydrationWarning>
                {new Date().toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-6">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
