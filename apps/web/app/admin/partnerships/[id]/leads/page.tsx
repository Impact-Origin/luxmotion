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

const GOLD = "#C9A96E";

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

function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card ${className}`}>
      {title ? (
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </div>
  );
}

function Kpi({
  label,
  value,
  Icon,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  Icon: typeof Mail;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        highlight
          ? "border-transparent text-[#1a1510]"
          : "border-border bg-card"
      }`}
      style={highlight ? { backgroundColor: GOLD } : undefined}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium uppercase tracking-wider ${
            highlight ? "text-[#1a1510]/70" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        <Icon
          className={`h-4 w-4 ${highlight ? "text-[#1a1510]/70" : "text-muted-foreground"}`}
        />
      </div>
      <p className="mt-2 text-3xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function TrendChart({ data }: { data: { label: string; count: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const W = 340;
  const H = 96;
  const PAD = 8;
  const n = Math.max(1, data.length);
  const x = (i: number) => PAD + (i * (W - 2 * PAD)) / Math.max(1, n - 1);
  const y = (v: number) => H - PAD - (v / max) * (H - 2 * PAD);
  const line = data.map((d, i) => `${x(i)},${y(d.count)}`).join(" ");
  const area = `${x(0)},${H - PAD} ${line} ${x(n - 1)},${H - PAD}`;
  const empty = data.every((d) => d.count === 0);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full">
        <defs>
          <linearGradient id="ldg-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.35" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </linearGradient>
        </defs>
        {!empty && <polygon points={area} fill="url(#ldg-trend)" />}
        <polyline
          points={line}
          fill="none"
          stroke={GOLD}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.count)} r="3" fill={GOLD} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between px-1 text-[11px] text-muted-foreground">
        {data.map((d, i) => (
          <span key={i} className="tabular-nums">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CategoryBars({
  items,
}: {
  items: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="space-y-3">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs text-muted-foreground">
            {it.label}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${(it.count / max) * 100}%`,
                backgroundColor: GOLD,
                minWidth: it.count > 0 ? "6px" : 0,
              }}
            />
          </div>
          <span className="w-8 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
            {it.count}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PartnershipLeadsPage() {
  const params = useParams();
  const id = params.id as Id<"partnerships">;
  const partnership = useQuery(api.partnerships.getById, { id });
  const stats = useQuery(api.partnerships.getLeadStats, { partnershipId: id });

  // Only categories that actually produced leads for this partner are shown —
  // a hotel never gets weddings, so its wedding category simply never appears.
  const cats = CATEGORIES.map((c) => ({
    ...c,
    count: stats?.[c.key]?.count ?? 0,
  }));
  const nonZero = cats
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
  const topCats = nonZero.slice(0, 3);

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
    return items.sort((a, b) => b.createdAt - a.createdAt).slice(0, 20);
  }, [stats]);

  const dash = (v: React.ReactNode) => (stats ? v : "…");

  return (
    <div className="space-y-6">
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
            Tudo o que veio desta parceria (atribuição por affiliate)
            {partnership ? (
              <span className="ml-1 font-mono text-xs">/{partnership.slug}</span>
            ) : null}
          </p>
        </div>
      </div>

      {/* KPIs — Total + the partner's most active categories (dynamic) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Total atribuído"
          value={dash(stats?.total ?? 0)}
          Icon={ShoppingCart}
          highlight
        />
        {topCats.map((c) => (
          <Kpi key={c.key} label={c.label} value={c.count} Icon={c.Icon} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Leads por mês (últimos 6 meses)">
          {stats ? (
            <TrendChart data={stats.timeline} />
          ) : (
            <div className="h-28 animate-pulse rounded bg-muted" />
          )}
        </Card>
        <Card title="Por categoria">
          {!stats ? (
            <div className="h-40 animate-pulse rounded bg-muted" />
          ) : nonZero.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Sem leads atribuídas ainda.
            </div>
          ) : (
            <CategoryBars items={nonZero} />
          )}
        </Card>
      </div>

      {/* Recent activity */}
      <Card title="Atividade recente">
        {activity.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {stats
              ? "Ainda não há nada atribuído a esta parceria."
              : "A carregar…"}
          </div>
        ) : (
          <div className="-m-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Nome</th>
                  <th className="px-5 py-2.5 font-medium">Categoria</th>
                  <th className="px-5 py-2.5 font-medium">Email</th>
                  <th className="px-5 py-2.5 font-medium">Estado</th>
                  <th className="px-5 py-2.5 text-right font-medium">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activity.map((a, i) => (
                  <tr key={i} className="hover:bg-accent/50">
                    <td className="max-w-[220px] truncate px-5 py-2.5 font-medium text-foreground">
                      {a.label}
                    </td>
                    <td className="px-5 py-2.5 text-muted-foreground">{a.cat}</td>
                    <td className="max-w-[200px] truncate px-5 py-2.5 text-muted-foreground">
                      {a.email ?? "—"}
                    </td>
                    <td className="px-5 py-2.5">
                      {a.status ? (
                        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
                          {a.status}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-2.5 text-right text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString("pt-PT")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
