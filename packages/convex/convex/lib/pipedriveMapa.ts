/**
 * Conversão dos formulários do site para a forma que o Pipedrive entende.
 *
 * Funções puras, sem `ctx` e sem `fetch`: são chamadas de dentro de uma query
 * (`pipedrive.mapearLead`) precisamente para que a filtragem aconteça **antes**
 * de os dados saírem da base. As candidaturas de motorista e de empresa trazem
 * IBAN, SWIFT, NIF e documentos; se o documento inteiro atravessasse a
 * fronteira para a action, esses campos ficavam ao alcance de qualquer
 * `console.log` que alguém acrescentasse mais tarde. Aqui só sai o que está
 * escrito à mão em cada `mapear*`.
 *
 * O texto das notas é em português, como todo o resto do backend. Não se importa
 * `next-intl` para dentro do Convex.
 */

import type { Doc } from "../_generated/dataModel";

/** As dez tabelas de formulário. O validador correspondente está em `pipedrive.ts`. */
export type TabelaLead =
  | "contactSubmissions"
  | "contactQuotes"
  | "tourInquiries"
  | "weddingQuoteSubmissions"
  | "schoolQuoteSubmissions"
  | "corporateRequests"
  | "partnerLeads"
  | "newsletterSubscriptions"
  | "partnerApplications"
  | "driverApplications";

export type LeadPipedrive = {
  /** O que se lê na Caixa de Leads. Começa sempre pela origem. */
  titulo: string;
  pessoa: { nome: string; email: string; telefone?: string };
  organizacao?: string;
  /** Em euros. Ausente quando não há orçamento — uma lead de €0 lê-se mal. */
  valor?: number;
  /** HTML para a Nota. Ausente quando não há detalhe que valha a pena. */
  nota?: string;
  /**
   * Newsletter: cria-se a Pessoa e fica por aí. Quem subscreve o rodapé não
   * pediu para ser contactado, e são três sítios do site a alimentar a mesma
   * tabela — em duas semanas a caixa era só isto e ninguém a lia.
   */
  semLead?: boolean;
};

// ---------------------------------------------------------------------------
// Utilitários

/** O `content` da Nota é HTML e vai para a interface do Pipedrive tal e qual. */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const LIMITE_TITULO = 120;

/** Junta as partes com " · ", ignorando as vazias, e corta pelo limite. */
function titulo(...partes: (string | undefined | null)[]): string {
  const t = partes
    .map((p) => p?.trim())
    .filter((p): p is string => !!p)
    .join(" · ");
  return t.length > LIMITE_TITULO ? t.slice(0, LIMITE_TITULO - 1) + "…" : t;
}

function encurtar(texto: string | undefined, max: number): string | undefined {
  if (!texto) return undefined;
  const t = texto.trim();
  if (!t) return undefined;
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

/**
 * O Pipedrive recusa uma Pessoa sem nome. `newsletterSubscriptions.name` é
 * opcional, portanto há sempre uma alternativa: a parte esquerda do email.
 */
function nomeSeguro(nome: string | undefined, email: string): string {
  const n = nome?.trim();
  if (n) return n;
  const local = email.split("@")[0]?.trim();
  return local || email;
}

function telefoneSeguro(telefone: string | undefined): string | undefined {
  const t = telefone?.trim();
  return t ? t : undefined;
}

/**
 * As datas estão guardadas em três formatos diferentes conforme a tabela:
 * `corporateRequests.eventDate` é epoch em ms, `schoolQuoteSubmissions
 * .departureTime` é ISO completo, e `weddingQuoteSubmissions.weddingDate` e
 * `tourInquiries.date` são o que o visitante escreveu. Um formatador só, que
 * nunca rebenta e devolve o original quando não reconhece.
 */
export function formatarData(valor: string | number | undefined): string | undefined {
  if (valor === undefined || valor === null || valor === "") return undefined;
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return typeof valor === "string" ? valor : undefined;
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const aaaa = d.getUTCFullYear();
  const hh = d.getUTCHours();
  const min = d.getUTCMinutes();
  const horas = hh || min ? ` ${String(hh).padStart(2, "0")}:${String(min).padStart(2, "0")}` : "";
  return `${dd}/${mm}/${aaaa}${horas}`;
}

function euros(valor: number | undefined): string | undefined {
  if (valor === undefined) return undefined;
  // Cêntimos só quando os há: um orçamento de 12 000 não precisa de ",00", mas
  // um total de 360,5 tem de se ler "360,50".
  const casas = Number.isInteger(valor) ? 0 : 2;
  return `€${valor.toLocaleString("pt-PT", { minimumFractionDigits: casas, maximumFractionDigits: 2 })}`;
}

function plural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

type Linha = [rotulo: string, valor: string | number | undefined | null | false];

/** Monta a Nota. Linhas sem valor caem fora; se não sobrar nada, não há nota. */
function nota(linhas: Linha[]): string | undefined {
  const uteis = linhas.filter(
    ([, v]) => v !== undefined && v !== null && v !== false && String(v).trim() !== "",
  );
  if (uteis.length === 0) return undefined;
  const itens = uteis
    .map(([rotulo, v]) => `<li><b>${escapar(rotulo)}:</b> ${escapar(String(v))}</li>`)
    .join("");
  return `<ul>${itens}</ul>`;
}

/** Aviso fixo nas candidaturas, para ninguém procurar no CRM o que lá não está. */
const SO_NO_BACKOFFICE =
  "Dados bancários, documentos e dados de terceiros ficam apenas no back-office.";

function comAviso(corpo: string | undefined): string {
  return `${corpo ?? ""}<p><i>${escapar(SO_NO_BACKOFFICE)}</i></p>`;
}

const NIVEIS: Record<string, string> = {
  survival: "básico",
  intermediate: "intermédio",
  fluent: "fluente",
};

const VIATURAS_ESCOLAS: Record<string, string> = {
  standard: "Standard",
  business: "Business",
  van: "Van",
  bus: "Autocarro",
};

const VIATURAS_CASAMENTO: Record<string, string> = {
  standard: "Standard",
  executive: "Executiva",
  limousine: "Limusina",
  classic: "Clássico",
  supercar: "Superdesportivo",
  van: "Van",
  minibus: "Minibus",
  coach: "Autocarro",
};

// ---------------------------------------------------------------------------
// Um mapeador por tabela

export function mapearContactSubmission(d: Doc<"contactSubmissions">): LeadPipedrive {
  return {
    titulo: titulo("Contacto", d.name),
    pessoa: { nome: nomeSeguro(d.name, d.email), email: d.email, telefone: telefoneSeguro(d.phone) },
    nota: nota([
      ["Mensagem", d.message],
      ["Parceiro", d.partnershipName],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearContactQuote(d: Doc<"contactQuotes">): LeadPipedrive {
  return {
    titulo: titulo("Orçamento", d.company, encurtar(d.subject, 50)),
    pessoa: {
      nome: nomeSeguro(d.fullName, d.email),
      email: d.email,
      telefone: telefoneSeguro(d.phone),
    },
    organizacao: d.company?.trim() || undefined,
    nota: nota([
      ["Assunto", d.subject],
      ["Mensagem", d.message],
      ["Empresa", d.company],
      ["Parceiro", d.partnershipName],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearTourInquiry(d: Doc<"tourInquiries">): LeadPipedrive {
  return {
    titulo: titulo("Tour", d.tourTitle ?? "sem tour associado", d.name, formatarData(d.date)),
    pessoa: { nome: nomeSeguro(d.name, d.email), email: d.email, telefone: telefoneSeguro(d.phone) },
    /* O tecto e não o chão: a caixa ordena-se pelo que o pedido pode valer, e
       os dois números ficam na nota de qualquer maneira. */
    valor: d.budgetMax ?? d.budgetMin,
    nota: nota([
      ["Tour", d.tourTitle],
      ["Ligação", d.tourSlug ? `/tours/${d.tourSlug}` : undefined],
      ["Data", d.datesFlexible ? `${formatarData(d.date) ?? "por definir"} (flexível)` : formatarData(d.date)],
      ["Pessoas", d.people],
      ["Idades", d.ageRange],
      ["País", d.country],
      ["Interesses", d.interests],
      [
        "Orçamento",
        d.budgetMin !== undefined || d.budgetMax !== undefined
          ? `${euros(d.budgetMin) ?? "?"} – ${euros(d.budgetMax) ?? "?"}`
          : undefined,
      ],
      ["Marketing", d.marketingOptIn && "aceita ser contactado"],
      ["Parceiro", d.partnershipName],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearWeddingQuote(d: Doc<"weddingQuoteSubmissions">): LeadPipedrive {
  return {
    titulo: titulo("Casamento", d.fullName, formatarData(d.weddingDate)),
    pessoa: {
      nome: nomeSeguro(d.fullName, d.email),
      email: d.email,
      telefone: telefoneSeguro(d.phone),
    },
    valor: d.budget,
    nota: nota([
      ["Data", formatarData(d.weddingDate)],
      ["Local", d.venue],
      ["Recolha", d.pickup],
      ["Convidados", d.guests],
      ["Viaturas", d.numVehicles],
      ["Tipo de viatura", d.vehicle ? (VIATURAS_CASAMENTO[d.vehicle] ?? d.vehicle) : undefined],
      ["Orçamento", euros(d.budget)],
      ["Mensagem", d.message],
      ["Parceiro", d.partnershipName],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearSchoolQuote(d: Doc<"schoolQuoteSubmissions">): LeadPipedrive {
  return {
    titulo: titulo("Escolar", d.name, encurtar(d.route, 40)),
    pessoa: { nome: nomeSeguro(d.name, d.email), email: d.email, telefone: telefoneSeguro(d.phone) },
    valor: d.budget,
    nota: nota([
      ["Rota", d.route],
      ["Percurso", d.pickup && d.dropoff ? `${d.pickup} → ${d.dropoff}` : (d.pickup ?? d.dropoff)],
      ["Partida", formatarData(d.departureTime)],
      ["Crianças", d.children],
      ["Viatura", d.vehicle ? (VIATURAS_ESCOLAS[d.vehicle] ?? d.vehicle) : undefined],
      ["Orçamento", euros(d.budget)],
      ["Mensagem", d.message],
      ["Parceiro", d.partnershipName],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearCorporateRequest(d: Doc<"corporateRequests">): LeadPipedrive {
  return {
    titulo: titulo("Corporate", d.companyName, d.fullName),
    pessoa: {
      nome: nomeSeguro(d.fullName, d.email),
      email: d.email,
      telefone: telefoneSeguro(d.phone),
    },
    organizacao: d.companyName?.trim() || undefined,
    valor: d.budget,
    nota: nota([
      ["Empresa", d.companyName],
      ["Data do evento", formatarData(d.eventDate)],
      ["Convidados", d.guests],
      ["Viatura", d.vehicleType],
      ["Orçamento", euros(d.budget)],
      ["Notas", d.notes],
      ["Posição na fila", d.queuePosition],
      ["Parceiro", d.partnershipName],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearPartnerLead(d: Doc<"partnerLeads">): LeadPipedrive {
  /* `partnerType`, `estimatedMonthlyVolume` e `howDidYouHear` são guardados já
     traduzidos na língua do visitante (`partner-lead-form.tsx:63`), portanto
     lêem-se mas não se filtram. E o volume é uma etiqueta ("50–100/mês"), não
     um número — não serve de valor da lead. */
  return {
    titulo: titulo("Parceria", d.companyName, d.city),
    pessoa: {
      nome: nomeSeguro(d.fullName, d.email),
      email: d.email,
      telefone: telefoneSeguro(d.phone),
    },
    organizacao: d.companyName?.trim() || undefined,
    nota: nota([
      ["Empresa", d.companyName],
      ["Tipo de parceiro", d.partnerType],
      ["Volume estimado", d.estimatedMonthlyVolume],
      ["Cidade", d.city],
      ["Como nos conheceu", d.howDidYouHear],
      ["Recebido", formatarData(d.createdAt)],
    ]),
  };
}

export function mapearNewsletter(d: Doc<"newsletterSubscriptions">): LeadPipedrive {
  return {
    semLead: true,
    titulo: titulo("Newsletter", d.name ?? d.email),
    pessoa: { nome: nomeSeguro(d.name, d.email), email: d.email },
    nota: undefined,
  };
}

/**
 * Candidatura de empresa. Lista branca à mão.
 *
 * Nunca sai: `billing*` (IBAN, SWIFT, NIF, morada, titular), nenhum
 * `document*Id`, `internalNotes` — e **o conteúdo de `drivers[]` e
 * `vehicles[]`**, que são nomes, emails, telefones e matrículas de terceiros
 * que nunca consentiram estar num CRM. Desses vai só a contagem.
 */
export function mapearPartnerApplication(d: Doc<"partnerApplications">): LeadPipedrive {
  const viaturas = d.vehicles?.length ?? 0;
  return {
    titulo: titulo("Candidatura frota", d.companyName, `${viaturas} viatura${viaturas === 1 ? "" : "s"}`),
    pessoa: {
      nome: nomeSeguro(d.representativeFullName, d.representativeEmail),
      email: d.representativeEmail,
      telefone: telefoneSeguro(d.representativePhone),
    },
    organizacao: d.companyName?.trim() || undefined,
    nota: comAviso(
      nota([
        ["Empresa", d.companyName],
        ["Zonas", d.operatingZones?.join(", ")],
        ["Motoristas declarados", d.driverCount],
        ["Motoristas na candidatura", d.drivers?.length],
        ["Viaturas na candidatura", viaturas],
        ["Motoristas à vontade com telemóvel", d.driversComfortableWithMobile === "yes" ? "sim" : "não"],
        ["WhatsApp", d.representativeWhatsapp],
        ["Posição na fila", d.queuePosition],
        ["Recebido", formatarData(d.createdAt)],
      ]),
    ),
  };
}

/**
 * Candidatura de motorista. Lista branca à mão.
 *
 * Nunca sai: `billing*` (IBAN, SWIFT, NIF, repartição, morada), nenhum id de
 * `_storage` (fotos, carta, seguro, comprovativo, vídeo), `internalNotes`. Fora
 * também por decisão: `vehiclePlate` (identifica a viatura e não serve para
 * qualificar ninguém) e `representativeEmail` (é o endereço de outra pessoa na
 * linha do candidato).
 */
export function mapearDriverApplication(d: Doc<"driverApplications">): LeadPipedrive {
  const linguas = d.languages?.map((l) => `${l.code} (${NIVEIS[l.level] ?? l.level})`).join(", ");
  const cadeirinhas = [
    d.childSeatBaby ? `${d.childSeatBaby} bebé` : null,
    d.childSeatChild ? `${d.childSeatChild} criança` : null,
    d.childSeatBooster ? `${d.childSeatBooster} elevatória` : null,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    titulo: titulo("Candidatura motorista", d.fullName, d.operatingZone),
    pessoa: { nome: nomeSeguro(d.fullName, d.email), email: d.email, telefone: telefoneSeguro(d.phone) },
    nota: comAviso(
      nota([
        ["Zona", d.operatingZone],
        ["WhatsApp", d.whatsapp],
        ["Línguas", linguas],
        ["Viatura", [d.vehicleBrand, d.vehicleModel, d.vehicleYear && `(${d.vehicleYear})`].filter(Boolean).join(" ")],
        ["Categoria", d.vehicleCategory],
        ["Cor", d.vehicleColor],
        ["Propriedade", d.vehicleOwnership],
        ["Lugares", d.vehiclePassengerCapacity],
        ["Bagagem", d.vehicleLuggageCapacity],
        ["Licença TVDE", d.vehicleTvdeLicensed],
        ["Cadeirinhas", cadeirinhas],
        ["Suporte de pranchas", d.surfboardRack && "sim"],
        ["Comodidades", d.amenities?.join(", ")],
        ["Disponibilidade", d.availabilityDays?.join(", ")],
        ["Turnos", d.availabilityShifts?.join(", ")],
        ["Como nos conheceu", d.referral],
        ["Posição na fila", d.queuePosition],
        ["Recebido", formatarData(d.createdAt)],
      ]),
    ),
  };
}

// ---------------------------------------------------------------------------
// Reserva paga -> negócio ganho

export type NegocioPipedrive = {
  titulo: string;
  pessoa: { nome: string; email: string; telefone?: string };
  valor: number;
  nota?: string;
};

/**
 * Um negócio por pagamento, não um por linha de encomenda: o `sendOrderPayload`
 * junta a ida, a volta e os tours vendidos em upsell, e uma ida-e-volta com um
 * tour apareceria como três cartões no funil se cada um virasse negócio.
 *
 * O `customerNif` fica de fora — é identificação fiscal, mesma gaveta dos IBAN.
 */
export function mapearReservaPaga(encomendas: Doc<"orders">[]): NegocioPipedrive | null {
  const principal = encomendas[0];
  if (!principal) return null;

  const email = principal.customerEmail?.trim();
  if (!email) return null;

  const referencia = principal.orderNumber ?? principal._id;
  const eTour = !!principal.tourBookingId;
  const rota = eTour
    ? encurtar(principal.arrival.location, 45)
    : `${encurtar(principal.departure.location, 35)} → ${encurtar(principal.arrival.location, 35)}`;

  const total = encomendas.reduce((soma, o) => soma + (o.totalAmount ?? 0), 0);
  const extras = encomendas
    .flatMap((o) => [
      ...(o.selectedCheckoutAddons ?? []).map((a) => `${a.label} (${euros(a.price)})`),
      ...(o.selectedAddons ?? []).map((a) => `${a.title} ×${a.quantity} (${euros(a.subtotal)})`),
    ])
    .join(", ");

  return {
    titulo: titulo(
      `Reserva ${referencia}`,
      rota,
      principal.isRoundTrip && !eTour ? "ida e volta" : undefined,
    ),
    pessoa: {
      nome: nomeSeguro(principal.customerName, email),
      email,
      telefone: telefoneSeguro(principal.customerPhone),
    },
    valor: total,
    nota: nota([
      ["Encomendas", encomendas.map((o) => o.orderNumber ?? o._id).join(", ")],
      ["Data", formatarData(principal.departureDate)],
      ["Passageiros", principal.passengers],
      [
        "Composição",
        principal.adults !== undefined || principal.children !== undefined
          ? `${plural(principal.adults ?? 0, "adulto", "adultos")}, ${plural(principal.children ?? 0, "criança", "crianças")}`
          : undefined,
      ],
      ["Percurso", `${principal.departure.location} → ${principal.arrival.location}`],
      ["Viatura", principal.vehicleName],
      ["Modo", principal.sharingMode === "shared" ? "lugar partilhado" : undefined],
      ["Pagamento", principal.paymentMethod],
      ["Extras", extras],
      ["Total", euros(total)],
      ["Parceiro", principal.partnershipName],
    ]),
  };
}
