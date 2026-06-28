"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Car,
  Building2,
  UserPlus,
  Map,
  CalendarDays,
  Sparkles,
  FileText,
  Users,
  UserCheck,
  Star,
  Mail,
  Send,
  Gem,
  Heart,
  GraduationCap,
  Briefcase,
  Handshake,
  IdCard,
  BarChart3,
  CalendarClock,
  Newspaper,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { UserNav } from "./user-nav";

export function AdminSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const tNumbers = useTranslations("adminNumbers");
  const tAvailability = useTranslations("adminAvailability");

  const sections = React.useMemo(
    () => [
      {
        label: "Fleet & partners",
        items: [
          { title: "Vehicles", url: "/admin/vehicles", icon: Car },
          { title: "Partnerships", url: "/admin/partnerships", icon: Building2 },
          { title: "Partner leads", url: "/admin/partner-leads", icon: UserPlus },
        ],
      },
      {
        label: "Catalog",
        items: [
          { title: "Tours", url: "/admin/tours", icon: Map },
          { title: "Events", url: "/admin/events", icon: CalendarDays },
          { title: "Experiences", url: "/admin/experiences", icon: Sparkles },
          { title: "Blogs", url: "/admin/blogs", icon: FileText },
        ],
      },
      {
        label: "People",
        items: [
          { title: "Team", url: "/admin/team", icon: Users },
          { title: "Drivers", url: "/admin/drivers", icon: UserCheck },
          { title: "Reviews", url: "/admin/reviews", icon: Star },
        ],
      },
      {
        label: "Inbox",
        items: [
          { title: "Contacts", url: "/admin/contacts", icon: Mail },
          { title: "Quote requests", url: "/admin/contact-quotes", icon: Send },
          { title: "Ultra-luxury inquiries", url: "/admin/tour-inquiries", icon: Gem },
          { title: "Wedding quotes", url: "/admin/wedding-quotes", icon: Heart },
          { title: "School quotes", url: "/admin/school-quotes", icon: GraduationCap },
          { title: "Corporate requests", url: "/admin/corporate-requests", icon: Briefcase },
        ],
      },
      {
        label: "Applications",
        items: [
          { title: "Partner applications", url: "/admin/partner-applications", icon: Handshake },
          { title: "Driver applications", url: "/admin/driver-applications", icon: IdCard },
        ],
      },
      {
        label: "Settings",
        items: [
          { title: tNumbers("nav"), url: "/admin/numbers", icon: BarChart3 },
          { title: tAvailability("title"), url: "/admin/availability", icon: CalendarClock },
          { title: "Newsletter", url: "/admin/newsletter", icon: Newspaper },
        ],
      },
    ],
    [tNumbers, tAvailability],
  );

  return (
    <div
      className={cn(
        "relative z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[264px]",
      )}
    >
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
        <Link href="/admin" className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="relative h-[11px] w-[20px]">
              <Image src="/svgs/lm-monogram.svg" alt="LuxMotion" fill className="object-contain" priority />
            </span>
          </span>
          {!collapsed && (
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-[15px] font-medium text-sidebar-primary">LuxMotion</span>
              <span className="mt-[3px] text-[10px] font-medium uppercase tracking-[2px] text-sidebar-foreground/60">
                Admin
              </span>
            </span>
          )}
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <nav className="flex flex-col gap-1.5">
          {sections.map((section, si) => (
            <div key={section.label} className="flex flex-col gap-0.5">
              {!collapsed ? (
                <p className="px-3 pb-0.5 text-[10px] font-medium uppercase leading-none tracking-[1.5px] text-sidebar-foreground/45">
                  {section.label}
                </p>
              ) : si > 0 ? (
                <div className="mx-2 mb-1 border-t border-sidebar-border" />
              ) : null}
              {section.items.map((item) => {
                const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-3 py-0.5 text-[13px] leading-tight transition-colors",
                      collapsed && "justify-center",
                      isActive
                        ? "bg-sidebar-accent font-medium text-sidebar-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-primary",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        isActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/60 group-hover:text-sidebar-primary",
                      )}
                      strokeWidth={1.8}
                    />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="shrink-0 border-t border-sidebar-border p-2.5">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between gap-3")}>
          <UserNav />
          {!collapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-medium text-sidebar-primary">Admin account</span>
              <span className="text-[10px] text-sidebar-foreground/60">LuxMotion · v1.0.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
