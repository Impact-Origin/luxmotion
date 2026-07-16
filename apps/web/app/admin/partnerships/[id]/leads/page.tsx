"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import type { Id } from "@workspace/convex/dataModel";
import {
  ArrowLeft,
  ShoppingCart,
  Ticket,
  Compass,
  Mail,
  FileText,
  Building2,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";

type StatKey =
  | "orders"
  | "tourBookings"
  | "tourInquiries"
  | "contactSubmissions"
  | "contactQuotes"
  | "corporateRequests"
  | "schoolQuoteSubmissions"
  | "weddingQuoteSubmissions";

const CATEGORIES: { key: StatKey; label: string; Icon: typeof Mail }[] = [
  { key: "orders", label: "Encomendas (transfers)", Icon: ShoppingCart },
  { key: "tourBookings", label: "Reservas de tour", Icon: Ticket },
  { key: "tourInquiries", label: "Pedidos de tour", Icon: Compass },
  { key: "contactSubmissions", label: "Contactos", Icon: Mail },
  { key: "contactQuotes", label: "Orçamentos (contacto)", Icon: FileText },
  { key: "corporateRequests", label: "Pedidos corporate", Icon: Building2 },
  { key: "schoolQuoteSubmissions", label: "Orçamentos escolas", Icon: GraduationCap },
  { key: "weddingQuoteSubmissions", label: "Orçamentos casamento", Icon: HeartHandshake },
];

export default function PartnershipLeadsPage() {
  const params = useParams();
  const id = params.id as Id<"partnerships">;
  const partnership = useQuery(api.partnerships.getById, { id });
  const stats = useQuery(api.partnerships.getLeadStats, { partnershipId: id });

  const total = stats
    ? CATEGORIES.reduce((sum, c) => sum + (stats[c.key]?.count ?? 0), 0)
    : 0;

  const activity = React.useMemo(() => {
    if (!stats) return [];
    const items: {
      cat: string;
      label: string;
      email: string | null;
      status: string | null;
      createdAt: number;
    }[] = [];
    for (const c of CATEGORIES) {
      for (const r of stats[c.key]?.recent ?? []) {
        items.push({ cat: c.label, ...r });
      }
    }
    return items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 15);
  }, [stats]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/partnerships"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-foreground">
            {partnership ? partnership.name : "…"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Leads e encomendas atribuídas a esta parceria
            {partnership ? (
              <span className="ml-1 font-mono text-xs">/{partnership.slug}</span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Total atribuído
        </p>
        <p className="mt-1 text-4xl font-bold text-foreground">
          {stats ? total : "…"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <div
            key={c.key}
            className="rounded-lg border border-border bg-card p-4"
          >
            <c.Icon className="h-5 w-5 text-muted-foreground" />
            <p className="mt-2 text-2xl font-bold text-foreground">
              {stats ? (stats[c.key]?.count ?? 0) : "…"}
            </p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">
            Atividade recente
          </h2>
        </div>
        {activity.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            {stats
              ? "Ainda não há nada atribuído a esta parceria."
              : "A carregar…"}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {activity.map((a, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {a.label}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.cat}
                    {a.email ? ` · ${a.email}` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  {a.status ? (
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                      {a.status}
                    </span>
                  ) : null}
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleDateString("pt-PT")}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
