"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Handshake, IdCard, type LucideIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import { PartnerApplicationsPanel } from "@/components/admin/applications/partner-applications"
import { DriverApplicationsPanel } from "@/components/admin/applications/driver-applications"

/**
 * Candidaturas de parceiros e de condutores, numa rota só.
 *
 * As duas páginas eram cópia literal uma da outra — toolbar, tabela, pager,
 * `StatusActions`, `StatusButton`, `Section`, `Field`, tudo repetido byte a
 * byte. O que difere de facto é só o corpo do painel de detalhe: os parceiros
 * têm listas de condutores e viaturas, os condutores têm galerias de fotos e
 * documentos. Por isso os dois painéis ficam separados; a navegação é que não
 * tinha razão para o estar.
 */
const TABS: { id: string; label: string; icon: LucideIcon; Panel: () => React.JSX.Element }[] = [
  { id: "parceiros", label: "Parceiros", icon: Handshake, Panel: PartnerApplicationsPanel },
  { id: "condutores", label: "Condutores", icon: IdCard, Panel: DriverApplicationsPanel },
]

export default function AdminApplicationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requested = searchParams.get("tipo")
  const active = TABS.find((t) => t.id === requested) ?? TABS[0]!

  return (
    <div className="space-y-6">
      <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-card p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() =>
              router.replace(
                tab.id === TABS[0]!.id
                  ? "/admin/applications"
                  : `/admin/applications?tipo=${tab.id}`,
              )
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active.id === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <active.Panel key={active.id} />
    </div>
  )
}
