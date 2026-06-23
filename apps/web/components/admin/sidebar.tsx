"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
  Building2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { UserNav } from "./user-nav";

const SERIF = "var(--font-title), 'Cormorant Garamond', serif";

export function AdminSidebar() {
  const pathname = usePathname();
  const tNumbers = useTranslations("adminNumbers");
  const tAvailability = useTranslations("adminAvailability");
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const items = React.useMemo(
    () => [
      { title: "Vehicles", url: "/admin/vehicles", icon: Car },
      { title: "Partnerships", url: "/admin/partnerships", icon: CalendarDays },
      { title: "Partner Leads", url: "/admin/partner-leads", icon: Building2 },
      { title: "Tours", url: "/admin/tours", icon: Map },
      { title: "Events", url: "/admin/events", icon: Calendar },
      { title: "Experiences", url: "/admin/experiences", icon: Briefcase },
      { title: "Team", url: "/admin/team", icon: Users },
      { title: "Drivers", url: "/admin/drivers", icon: UserCheck },
      { title: "Blogs", url: "/admin/blogs", icon: FileText },
      { title: "Reviews", url: "/admin/reviews", icon: MessageSquare },
      { title: tNumbers("nav"), url: "/admin/numbers", icon: SlidersHorizontal },
      { title: tAvailability("title"), url: "/admin/availability", icon: CalendarClock },
      { title: "Contacts", url: "/admin/contacts", icon: Mail },
      { title: "Quote Requests", url: "/admin/contact-quotes", icon: Send },
      { title: "Ultra-Luxury Inquiries", url: "/admin/tour-inquiries", icon: Gem },
      { title: "Wedding Quotes", url: "/admin/wedding-quotes", icon: Heart },
      { title: "School Quotes", url: "/admin/school-quotes", icon: GraduationCap },
      { title: "Newsletter", url: "/admin/newsletter", icon: Newspaper },
      { title: "Partner Applications", url: "/admin/partner-applications", icon: Handshake },
      { title: "Driver Applications", url: "/admin/driver-applications", icon: IdCard },
    ],
    [tNumbers, tAvailability],
  );

  return (
    <div
      className={cn(
        "relative z-20 flex flex-col border-r border-[#e7ddca] bg-[#fffdf9] transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[80px]" : "w-[264px]",
      )}
    >
      <div className="flex h-16 items-center border-b border-[#e7ddca] px-4">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d8c7a3] bg-[#A08248]/[0.08]">
            <span className="relative h-[11px] w-[20px]">
              <Image src="/svgs/lm-monogram.svg" alt="LuxMotion" fill className="object-contain" priority />
            </span>
          </span>
          {!isCollapsed && (
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate text-[19px] text-[#211c16]" style={{ fontFamily: SERIF }}>
                LuxMotion
              </span>
              <span className="mt-[3px] text-[9px] font-semibold uppercase tracking-[2.5px] text-[#A08248]">
                Admin
              </span>
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-0.5">
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link
                key={item.title}
                href={item.url}
                title={isCollapsed ? item.title : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isCollapsed && "justify-center",
                  isActive
                    ? "bg-[#A08248]/[0.10] font-semibold text-[#8a6a30]"
                    : "font-medium text-[#6b6358] hover:bg-[#A08248]/[0.06] hover:text-[#211c16]",
                )}
              >
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive ? "text-[#A08248]" : "text-[#aaa08d] group-hover:text-[#8a6a30]",
                  )}
                  strokeWidth={1.8}
                />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#e7ddca] p-4">
        <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between gap-3")}>
          <UserNav />
          {!isCollapsed && (
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xs font-semibold text-[#211c16]">Admin Account</span>
              <span className="text-[10px] text-[#a99e8c]">LuxMotion · v1.0.0</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-[68px] z-30 flex h-6 w-6 items-center justify-center rounded-full border border-[#e7ddca] bg-[#fffdf9] text-[#A08248] shadow-sm transition-colors hover:text-[#8a6a30]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </div>
  );
}
