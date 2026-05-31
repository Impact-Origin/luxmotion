"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  CalendarDays,
  Users,
  Car,
  ChevronLeft,
  ChevronRight,
  FileText,
  Map,
  Calendar,
  MessageSquare,
  Mail,
  Newspaper,
  Briefcase,
  UserCheck,
  SlidersHorizontal,
  Heart,
  GraduationCap,
  Handshake,
  IdCard,
  CalendarClock,
  Gem,
  Send,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { UserNav } from "./user-nav";

export function AdminSidebar() {
  const pathname = usePathname();
  const tNumbers = useTranslations("adminNumbers");
  const tAvailability = useTranslations("adminAvailability");
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const items = React.useMemo(
    () => [
      {
        title: "Vehicles",
        url: "/admin/vehicles",
        icon: Car,
      },
      {
        title: "Partnerships",
        url: "/admin/partnerships",
        icon: CalendarDays,
      },
      {
        title: "Tours",
        url: "/admin/tours",
        icon: Map,
      },
      {
        title: "Events",
        url: "/admin/events",
        icon: Calendar,
      },
      {
        title: "Experiences",
        url: "/admin/experiences",
        icon: Briefcase,
      },
      {
        title: "Team",
        url: "/admin/team",
        icon: Users,
      },
      {
        title: "Drivers",
        url: "/admin/drivers",
        icon: UserCheck,
      },
      {
        title: "Blogs",
        url: "/admin/blogs",
        icon: FileText,
      },
      {
        title: "Reviews",
        url: "/admin/reviews",
        icon: MessageSquare,
      },
      {
        title: tNumbers("nav"),
        url: "/admin/numbers",
        icon: SlidersHorizontal,
      },
      {
        title: tAvailability("title"),
        url: "/admin/availability",
        icon: CalendarClock,
      },
      {
        title: "Contacts",
        url: "/admin/contacts",
        icon: Mail,
      },
      {
        title: "Quote Requests",
        url: "/admin/contact-quotes",
        icon: Send,
      },
      {
        title: "Ultra-Luxury Inquiries",
        url: "/admin/tour-inquiries",
        icon: Gem,
      },
      {
        title: "Wedding Quotes",
        url: "/admin/wedding-quotes",
        icon: Heart,
      },
      {
        title: "School Quotes",
        url: "/admin/school-quotes",
        icon: GraduationCap,
      },
      {
        title: "Newsletter",
        url: "/admin/newsletter",
        icon: Newspaper,
      },
      {
        title: "Partner Applications",
        url: "/admin/partner-applications",
        icon: Handshake,
      },
      {
        title: "Driver Applications",
        url: "/admin/driver-applications",
        icon: IdCard,
      },
    ],
    [tNumbers],
  );

  return (
    <div
      className={cn(
        "relative flex flex-col border-r bg-white transition-all duration-300 ease-in-out z-20",
        isCollapsed ? "w-[80px]" : "w-[260px]",
      )}
    >
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          {!isCollapsed && (
            <span className="text-lg font-bold text-zinc-900 tracking-tight">
              EasyTransfer
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-zinc-900" : "text-zinc-400",
                  )}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between gap-4",
          )}
        >
          <UserNav />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-900">
                Admin Account
              </span>
              <span className="text-[10px] text-zinc-500">v1.0.0</span>
            </div>
          )}
        </div>
      </div>

      <button
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-white flex items-center justify-center text-zinc-400 hover:text-zinc-900 shadow-sm transition-all z-30"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}
