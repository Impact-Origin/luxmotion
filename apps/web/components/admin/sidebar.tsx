"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Receipt,
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
  ShoppingBag,
  ChevronDown,
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
        label: "Operations",
        items: [
          { title: "Orders", url: "/admin/orders", icon: Receipt },
        ],
      },
      {
        label: "Fleet & partners",
        items: [
          { title: "Vehicles", url: "/admin/vehicles", icon: Car },
          { title: "Partnerships", url: "/admin/partnerships", icon: Building2 },
          { title: "Partner leads", url: "/admin/partner-leads", icon: UserPlus },
        ],
      },
      {
        /* Os títulos aqui são deliberadamente explícitos. Havia TRÊS entradas a
           que se podia chamar "experiences" — a galeria do Sobre nós, o catálogo
           corporate e os extras do checkout — e ninguém sabia qual era qual.
           O URL fica, muda só o que se lê. */
        label: "Catalog",
        items: [
          { title: "Tours", url: "/admin/tours", icon: Map },
          { title: "Events", url: "/admin/events", icon: CalendarDays },
          { title: "Upsells (checkout)", url: "/admin/upsells", icon: ShoppingBag, badge: "NOVO" },
          { title: "Corporate", url: "/admin/corporate-experiences", icon: Briefcase },
          { title: "Galeria “Sobre nós”", url: "/admin/experiences", icon: Sparkles },
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
        /* Sete entradas de caixa de entrada e duas de candidaturas passaram a
           duas rotas com separadores. O que se perdeu foi só ruído: quatro das
           sete eram a mesma tabela com outras colunas. */
        label: "Inbox",
        items: [
          { title: "Caixa de entrada", url: "/admin/inbox", icon: Mail },
          { title: "Candidaturas", url: "/admin/applications", icon: Handshake },
        ],
      },
      {
        label: "Settings",
        items: [
          { title: tNumbers("nav"), url: "/admin/numbers", icon: BarChart3 },
          { title: tAvailability("title"), url: "/admin/availability", icon: CalendarClock },
        ],
      },
    ],
    [tNumbers, tAvailability],
  );

  const isItemActive = React.useCallback(
    (url: string) => pathname === url || pathname.startsWith(url + "/"),
    [pathname],
  );

  const activeSection = React.useMemo(
    () => sections.find((s) => s.items.some((i) => isItemActive(i.url)))?.label,
    [sections, isItemActive],
  );

  // Collapsible sections: the section of the current page is open; others closed.
  const [openSections, setOpenSections] = React.useState<string[]>(
    activeSection ? [activeSection] : [],
  );
  React.useEffect(() => {
    if (activeSection) {
      setOpenSections((prev) => (prev.includes(activeSection) ? prev : [...prev, activeSection]));
    }
  }, [activeSection]);

  const toggleSection = (label: string) =>
    setOpenSections((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );

  return (
    <div
      className={cn(
        "relative z-20 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[80px]" : "w-[264px]",
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-4">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
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

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        <nav className="flex flex-col gap-1">
          {sections.map((section, si) => {
            const open = collapsed || openSections.includes(section.label);
            return (
              <div key={section.label} className="flex flex-col">
                {!collapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.label)}
                    className="flex items-center justify-between rounded-md px-3 py-1.5 text-[10px] font-medium uppercase tracking-[1.5px] text-sidebar-foreground/45 transition-colors hover:text-sidebar-foreground/80"
                  >
                    <span>{section.label}</span>
                    <ChevronDown className={cn("size-3.5 transition-transform", open ? "" : "-rotate-90")} />
                  </button>
                ) : si > 0 ? (
                  <div className="mx-2 my-1 border-t border-sidebar-border" />
                ) : null}

                {open && (
                  <div className="flex flex-col gap-0.5 pb-1">
                    {section.items.map((item) => {
                      const isActive = isItemActive(item.url);
                      return (
                        <Link
                          key={item.url}
                          href={item.url}
                          title={collapsed ? item.title : undefined}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            collapsed && "justify-center",
                            isActive
                              ? "bg-sidebar-accent font-medium text-sidebar-primary"
                              : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-primary",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "size-[18px] shrink-0 transition-colors",
                              isActive
                                ? "text-sidebar-primary"
                                : "text-sidebar-foreground/60 group-hover:text-sidebar-primary",
                            )}
                            strokeWidth={1.8}
                          />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                          {/* Selo opcional ("NOVO"). Só com a sidebar aberta:
                              recolhida não há largura para ele. */}
                          {!collapsed && "badge" in item && item.badge && (
                            <span className="ml-auto shrink-0 rounded bg-sidebar-primary/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-sidebar-primary">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 border-t border-sidebar-border p-4">
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
