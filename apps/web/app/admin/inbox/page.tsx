"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mail,
  Send,
  Gem,
  Heart,
  GraduationCap,
  Briefcase,
  Newspaper,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"
import {
  ContactsInbox,
  TourInquiriesInbox,
  WeddingQuotesInbox,
  SchoolQuotesInbox,
} from "@/components/admin/inbox/submission-types"
import { QuoteRequestsInbox } from "@/components/admin/inbox/quote-requests"
import { CorporateRequestsInbox } from "@/components/admin/inbox/corporate-requests"
import { NewsletterInbox } from "@/components/admin/inbox/newsletter"

/**
 * Tudo o que entra de fora, numa rota só.
 *
 * Eram sete entradas na sidebar e sete ficheiros de rota — `contacts`,
 * `contact-quotes`, `tour-inquiries`, `wedding-quotes`, `school-quotes`,
 * `corporate-requests` e `newsletter` — e quatro deles eram wrappers finos da
 * mesma tabela. O tipo vive no URL (`?tipo=`), para o separador aberto
 * sobreviver a um F5 e poder ser partilhado.
 */
const TYPES: { id: string; label: string; icon: LucideIcon; Panel: () => React.JSX.Element }[] = [
  { id: "contactos", label: "Contactos", icon: Mail, Panel: ContactsInbox },
  { id: "orcamentos", label: "Pedidos de orçamento", icon: Send, Panel: QuoteRequestsInbox },
  { id: "ultra-luxo", label: "Ultra-luxo", icon: Gem, Panel: TourInquiriesInbox },
  { id: "casamentos", label: "Casamentos", icon: Heart, Panel: WeddingQuotesInbox },
  { id: "escolas", label: "Escolas", icon: GraduationCap, Panel: SchoolQuotesInbox },
  { id: "corporate", label: "Corporate", icon: Briefcase, Panel: CorporateRequestsInbox },
  { id: "newsletter", label: "Newsletter", icon: Newspaper, Panel: NewsletterInbox },
]

export default function AdminInboxPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requested = searchParams.get("tipo")
  const active = TYPES.find((t) => t.id === requested) ?? TYPES[0]!

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1">
        {TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() =>
              router.replace(
                type.id === TYPES[0]!.id ? "/admin/inbox" : `/admin/inbox?tipo=${type.id}`,
              )
            }
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active.id === type.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <type.icon className="size-4" />
            {type.label}
          </button>
        ))}
      </div>

      {/* `key` força a remontagem ao trocar de tipo: sem isso o estado interno
          da tabela (pesquisa, filtro, página) transitava de um tipo para o
          seguinte e mostrava resultados vazios sem explicação. */}
      <active.Panel key={active.id} />
    </div>
  )
}
