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
  Briefcase,
  Handshake,
  BarChart3,
  CalendarClock,
  ShoppingBag,
  Images,
  Layers,
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
        /* Havia TRÊS entradas a que se podia chamar "experiences". Os nomes
           abaixo são os que o cliente usa:
             /admin/upsells               → "Upsells"
             /admin/corporate-experiences → "Corporate"
             /admin/experiences           → "Experiências passadas - sobre nós"
           A última tem esse nome comprido de propósito: diz o que é e onde
           aparece, que é a única forma de não se confundir com as outras duas. */
        label: "Catalog",
        items: [
          { title: "Tours", url: "/admin/tours", icon: Map },
          { title: "Events", url: "/admin/events", icon: CalendarDays },
          { title: "Upsells", url: "/admin/upsells", icon: ShoppingBag },
          /* Um extra definido uma vez, mostrado em todos os tours ou eventos
             do seu âmbito. */
          { title: "Extras universais", url: "/admin/universal-addons", icon: Layers },
          /* As imagens dos extras carregam-se aqui uma vez; associam-se
             depois, dentro do tour ou do evento. */
          { title: "Imagens dos extras", url: "/admin/addon-images", icon: Images },
          { title: "Corporate", url: "/admin/corporate-experiences", icon: Briefcase },
          { title: "Experiências passadas - sobre nós", url: "/admin/experiences", icon: Sparkles },
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
          {/* Tudo à vista. As secções eram dobráveis e só abria a da página
              actual, o que obrigava a caçar entradas atrás de um chevron —
              agora que são 17 e não 23, cabem todas sem scroll. */}
          {sections.map((section, si) => {
            return (
              <div key={section.label} className="flex flex-col">
                {!collapsed ? (
                  <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-[1.5px] text-sidebar-foreground/45">
                    {section.label}
                  </div>
                ) : si > 0 ? (
                  <div className="mx-2 my-1 border-t border-sidebar-border" />
                ) : null}

                <div className="flex flex-col gap-0.5 pb-1">
                  {section.items.map((item) => {
                    const isActive = isItemActive(item.url);
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        title={item.title}
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
                        {/* Sem `truncate`: "Experiências passadas - sobre nós"
                            precisa de 244px e a sidebar só dá 186, e cortado
                            perde-se justamente a parte que o desambigua.
                            Quebra para duas linhas em vez de ficar a meio. */}
                        {!collapsed && <span className="leading-tight">{item.title}</span>}
                      </Link>
                    );
                  })}
                </div>
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
