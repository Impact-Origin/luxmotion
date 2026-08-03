"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { SubmissionsTable } from "@/components/admin/submissions-table"

/**
 * As caixas de entrada que são só configuração sobre a `SubmissionsTable`.
 *
 * Eram cinco rotas separadas — `/admin/contacts`, `/admin/tour-inquiries`,
 * `/admin/wedding-quotes`, `/admin/school-quotes` — cada uma um ficheiro de 50 a
 * 100 linhas cujo corpo inteiro era um `<SubmissionsTable>`. Aqui é a mesma
 * configuração, num sítio só, com as rotas todas colapsadas em `/admin/inbox`.
 *
 * Cada tipo continua a ter a sua própria função por causa dos tipos: as queries
 * e os `Id<"...">` são diferentes em cada tabela do Convex.
 */

/* Estes quatro tipos partilham os mesmos três estados no backend. A tabela
   aceita qualquer conjunto (há tipos com `inProgress`, `approved`…), por isso
   é aqui que se estreita outra vez para o que a mutation aceita. */
type Status = "new" | "read" | "archived"

const dash = <span className="text-muted-foreground">—</span>

/** Devolve `null` quando não há valor, para o detalhe poder omitir a linha. */
const fmtEuro = (n: number | undefined) =>
  typeof n === "number" ? `€${n.toLocaleString("de-DE")}` : null

export function ContactsInbox() {
  const submissions = useQuery(api.contactSubmissions.list)
  const setStatus = useMutation(api.contactSubmissions.setStatus)
  const remove = useMutation(api.contactSubmissions.remove)

  return (
    <SubmissionsTable
      emptyTitle="Ainda não há contactos"
      emptyDescription="As mensagens do formulário de contacto geral aparecem aqui."
      data={submissions}
      nameKey="name"
      showPartner
      searchKeys={["name", "email", "phone", "message"]}
      onSetStatus={(id, status) =>
        setStatus({ id: id as Id<"contactSubmissions">, status: status as Status })
      }
      onDelete={(id) => remove({ id: id as Id<"contactSubmissions"> })}
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail", copyable: true },
        {
          key: "phone",
          label: "Telefone",
          copyable: true,
          render: (r) => r.phone || dash,
        },
        {
          key: "message",
          label: "Mensagem",
          className: "max-w-[320px]",
          render: (r) => (
            <span className="line-clamp-1 text-muted-foreground">{r.message}</span>
          ),
        },
      ]}
      detailFields={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "phone", label: "Telefone" },
        { key: "message", label: "Mensagem" },
      ]}
    />
  )
}

const fmtBudget = (r: { budgetMin?: number; budgetMax?: number }) =>
  r.budgetMin != null && r.budgetMax != null
    ? `€${r.budgetMin.toLocaleString("de-DE")} – €${r.budgetMax.toLocaleString("de-DE")}`
    : "—"

export function TourInquiriesInbox() {
  const inquiries = useQuery(api.tourInquiries.list)
  const setStatus = useMutation(api.tourInquiries.setStatus)
  const remove = useMutation(api.tourInquiries.remove)

  return (
    <SubmissionsTable
      emptyTitle="Ainda não há pedidos"
      emptyDescription="Os pedidos das páginas de ultra-luxo aparecem aqui."
      data={inquiries}
      nameKey="name"
      showPartner
      searchKeys={["name", "email", "phone", "tourTitle", "interests", "country"]}
      onSetStatus={(id, status) => setStatus({ id: id as Id<"tourInquiries">, status: status as Status })}
      onDelete={(id) => remove({ id: id as Id<"tourInquiries"> })}
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail", copyable: true },
        { key: "phone", label: "Telefone", copyable: true },
        {
          key: "tourTitle",
          label: "Tour",
          className: "max-w-[220px]",
          render: (r) => (
            <span className="line-clamp-1 text-muted-foreground">{r.tourTitle || "—"}</span>
          ),
        },
        { key: "people", label: "Pessoas", render: (r) => r.people || "—" },
        { key: "budget", label: "Orçamento", render: (r) => fmtBudget(r) },
      ]}
      detailFields={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "phone", label: "Telefone" },
        { key: "country", label: "País" },
        { key: "tourTitle", label: "Tour" },
        { key: "date", label: "Data preferida" },
        {
          key: "datesFlexible",
          label: "Datas flexíveis",
          render: (r) => (r.datesFlexible ? "Sim" : "Não"),
        },
        { key: "people", label: "Pessoas" },
        { key: "ageRange", label: "Faixa etária" },
        { key: "budget", label: "Orçamento por pessoa", render: (r) => fmtBudget(r) },
        { key: "interests", label: "Interesses" },
        {
          key: "marketingOptIn",
          label: "Aceita marketing",
          render: (r) => (r.marketingOptIn ? "Sim" : "Não"),
        },
      ]}
    />
  )
}

export function WeddingQuotesInbox() {
  const submissions = useQuery(api.weddingQuoteSubmissions.list)
  const setStatus = useMutation(api.weddingQuoteSubmissions.setStatus)
  const remove = useMutation(api.weddingQuoteSubmissions.remove)

  return (
    <SubmissionsTable
      emptyTitle="Ainda não há pedidos de casamento"
      emptyDescription="Os pedidos de orçamento da página de casamentos aparecem aqui."
      data={submissions}
      nameKey="fullName"
      showPartner
      searchKeys={["fullName", "email", "phone", "venue", "message"]}
      onSetStatus={(id, status) =>
        setStatus({ id: id as Id<"weddingQuoteSubmissions">, status: status as Status })
      }
      onDelete={(id) => remove({ id: id as Id<"weddingQuoteSubmissions"> })}
      columns={[
        { key: "fullName", label: "Casal" },
        { key: "email", label: "E-mail", copyable: true },
        { key: "phone", label: "Telefone", copyable: true },
        { key: "weddingDate", label: "Data", render: (r) => r.weddingDate || dash },
        { key: "guests", label: "Convidados", render: (r) => r.guests ?? dash },
        // O orçamento é dos primeiros dados que se quer ver ao triar um pedido,
        // e não estava na tabela nem no detalhe.
        { key: "budget", label: "Orçamento", render: (r) => fmtEuro(r.budget) ?? dash },
        {
          key: "vehicle",
          label: "Viatura",
          render: (r) => (r.vehicle ? <span className="capitalize">{r.vehicle}</span> : dash),
        },
      ]}
      detailFields={[
        { key: "fullName", label: "Casal" },
        { key: "email", label: "E-mail" },
        { key: "phone", label: "Telefone" },
        { key: "weddingDate", label: "Data do casamento" },
        { key: "guests", label: "Convidados" },
        { key: "venue", label: "Local" },
        { key: "pickup", label: "Recolha" },
        { key: "numVehicles", label: "Nº de viaturas" },
        {
          key: "vehicle",
          label: "Viatura preferida",
          render: (r) => (r.vehicle ? <span className="capitalize">{r.vehicle}</span> : null),
        },
        { key: "budget", label: "Orçamento", render: (r) => fmtEuro(r.budget) },
        { key: "message", label: "Notas" },
      ]}
    />
  )
}

function formatDateTime(iso: string | undefined) {
  if (!iso) return null
  const d = new Date(iso)
  if (!Number.isFinite(d.getTime())) return iso
  return d.toLocaleString("pt-PT", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function SchoolQuotesInbox() {
  const submissions = useQuery(api.schoolQuoteSubmissions.list)
  const setStatus = useMutation(api.schoolQuoteSubmissions.setStatus)
  const remove = useMutation(api.schoolQuoteSubmissions.remove)

  return (
    <SubmissionsTable
      emptyTitle="Ainda não há pedidos de escolas"
      emptyDescription="Os pedidos de orçamento da página de escolas aparecem aqui."
      data={submissions}
      nameKey="name"
      showPartner
      searchKeys={["name", "email", "phone", "route", "pickup", "dropoff", "message"]}
      onSetStatus={(id, status) =>
        setStatus({ id: id as Id<"schoolQuoteSubmissions">, status: status as Status })
      }
      onDelete={(id) => remove({ id: id as Id<"schoolQuoteSubmissions"> })}
      columns={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail", copyable: true },
        { key: "phone", label: "Telefone", copyable: true },
        { key: "children", label: "Crianças", render: (r) => r.children ?? dash },
        {
          key: "budget",
          label: "Orçamento",
          render: (r) =>
            typeof r.budget === "number" ? `€${r.budget.toLocaleString("de-DE")}` : dash,
        },
        { key: "route", label: "Percurso", render: (r) => r.route || dash },
        {
          key: "vehicle",
          label: "Viatura",
          render: (r) => (r.vehicle ? <span className="capitalize">{r.vehicle}</span> : dash),
        },
      ]}
      detailFields={[
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "phone", label: "Telefone" },
        { key: "children", label: "Crianças" },
        {
          key: "budget",
          label: "Orçamento",
          render: (r) =>
            typeof r.budget === "number" ? `€${r.budget.toLocaleString("de-DE")}` : null,
        },
        { key: "route", label: "Percurso" },
        {
          key: "departureTime",
          label: "Partida",
          render: (r) => formatDateTime(r.departureTime),
        },
        { key: "pickup", label: "Recolha" },
        { key: "dropoff", label: "Destino" },
        {
          key: "vehicle",
          label: "Viatura",
          render: (r) => (r.vehicle ? <span className="capitalize">{r.vehicle}</span> : null),
        },
        { key: "message", label: "Mensagem" },
      ]}
    />
  )
}
