"use client"

/**
 * As três maquetas da app do motorista — nova reserva, atribuir motorista e
 * pagamentos — partilhadas pela página dos motoristas individuais (/drivers) e
 * pela das empresas parceiras (/partners). São o mesmo produto, por isso os
 * ecrãs são os mesmos e o texto vem do mesmo sítio.
 */

import * as React from "react"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

const SCREEN_BG =
  "linear-gradient(160deg, rgb(15, 26, 12) 0%, rgb(17, 17, 24) 100%)"


function MiniPhoneShell({
  children,
  time,
  /** Quando o próprio cabeçalho já mostra a hora, como no ecrã de reserva. */
  barraDeEstado = true,
}: {
  children: React.ReactNode
  time: string
  barraDeEstado?: boolean
}) {
  return (
    <div className="bg-[#111110] border-4 border-[#222] h-[178px] w-[100px] relative rounded-[18px] shadow-[0_12px_40px_0_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
      <div
        className="absolute -translate-x-1/2 bg-[#222] h-[7px] left-1/2 rounded-b-[5px] top-[1px] w-[28px] z-10"
      />
      <div
        className="absolute inset-[1px] flex flex-col rounded-[15px] overflow-hidden"
        style={{ backgroundImage: SCREEN_BG }}
      >
        {barraDeEstado ? (
          <div className="flex h-4 items-center justify-end pb-0.5 pt-2.5 px-1.5">
            <span
              className="text-[5px] text-[rgba(255,255,255,0.3)] leading-none"
              style={SANS_FONT}
            >
              {time}
            </span>
          </div>
        ) : (
          <div className="h-2.5" />
        )}
        {children}
      </div>
    </div>
  )
}

/**
 * Ecrã de nova reserva, desenhado a partir do mockup fornecido: ponto e título
 * na mesma linha da hora, selo de antecedência ao lado do valor, rota em duas
 * linhas com a preposição em peso normal, e o botão em contorno, não cheio.
 */
function PhoneStep1({ tNav }: { tNav: (k: string) => string }) {
  return (
    <MiniPhoneShell time="09:41" barraDeEstado={false}>
      <div className="flex items-center justify-between gap-1 px-[6px] pb-[5px] pt-[3px]">
        <span className="flex items-center gap-[3px] min-w-0">
          <span className="bg-[#c4973e] rounded-full size-[3px] shrink-0" />
          <span
            className="text-[8px] text-white leading-none truncate"
            style={SERIF_FONT}
          >
            {tNav("step1Title")}
          </span>
        </span>
        <span
          className="text-[5px] text-[rgba(255,255,255,0.45)] leading-none shrink-0"
          style={SANS_FONT}
        >
          09:41
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[4px] px-[6px] pb-[5px] min-h-0">
        <div className="border border-[rgba(201,169,110,0.45)] flex flex-col gap-[3px] p-[5px]">
          <div className="flex items-center justify-between gap-1">
            <span
              className="border border-[rgba(201,169,110,0.55)] text-[#c4973e] text-[4px] font-bold uppercase tracking-[0.4px] leading-none px-[3px] py-[2px]"
              style={SANS_FONT}
            >
              {tNav("step1Badge")}
            </span>
            <span
              className="text-[#c4973e] text-[9px] leading-none"
              style={SERIF_FONT}
            >
              € 60,00
            </span>
          </div>

          <p
            className="text-[6px] text-white font-bold leading-[8px]"
            style={SANS_FONT}
          >
            {tNav("step1Origin")}{" "}
            <span className="font-normal">{tNav("step1To")}</span>{" "}
            {tNav("step1Dest")}
          </p>

          <p
            className="text-[5px] text-[rgba(255,255,255,0.45)] leading-[7px]"
            style={SANS_FONT}
          >
            {tNav("step1Meta")}
          </p>

          <div className="border border-[rgba(201,169,110,0.55)] flex justify-center mt-[1px] py-[3px] px-1">
            <span
              className="text-[#c4973e] text-[6px] font-semibold leading-none"
              style={SANS_FONT}
            >
              {tNav("step1Cta")}
            </span>
          </div>
        </div>

        {/* Reservas seguintes, ainda por abrir: blocos cheios, sem conteúdo. */}
        <div className="bg-[rgba(255,255,255,0.04)] h-[15px]" />
        <div className="bg-[rgba(255,255,255,0.04)] h-[15px]" />
      </div>

      {/* Três separadores, com o primeiro aceso — o mesmo esquema do ecrã de
          atribuição, onde acende o do meio. */}
      <div className="flex gap-[4px] items-center justify-center pb-[5px]">
        <span className="bg-[#c4973e] h-[2px] rounded-[1px] w-[12px]" />
        <span className="bg-[rgba(255,255,255,0.12)] h-[2px] rounded-[1px] w-[12px]" />
        <span className="bg-[rgba(255,255,255,0.12)] h-[2px] rounded-[1px] w-[12px]" />
      </div>
    </MiniPhoneShell>
  )
}

/** Iniciais do motorista, para o quadrado do avatar: "Tiago Mendes" → "TM". */
function iniciais(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? "")
    .join("")
}

function LinhaMotorista({
  nome,
  carro,
  escolhido,
}: {
  nome: string
  carro: string
  escolhido: boolean
}) {
  return (
    <div
      className={
        escolhido
          ? "border border-[rgba(201,169,110,0.5)] bg-[rgba(201,169,110,0.07)] flex gap-[4px] items-center p-[4px]"
          : "border border-[rgba(255,255,255,0.09)] flex gap-[4px] items-center p-[4px]"
      }
    >
      <span
        className={`flex items-center justify-center shrink-0 size-[16px] border ${
          escolhido
            ? "border-[rgba(201,169,110,0.5)] text-[#c4973e]"
            : "border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.35)]"
        }`}
      >
        <span className="text-[5px] leading-none" style={SERIF_FONT}>
          {iniciais(nome)}
        </span>
      </span>

      <span className="flex flex-col gap-px min-w-0 flex-1">
        <span
          className="text-[6px] text-white font-bold leading-[7.5px]"
          style={SANS_FONT}
        >
          {nome}
        </span>
        <span
          className="text-[4.5px] text-[rgba(255,255,255,0.4)] leading-[6px]"
          style={SANS_FONT}
        >
          {carro}
        </span>
      </span>

      {escolhido && (
        <span className="border border-[rgba(201,169,110,0.5)] flex items-center justify-center shrink-0 size-[9px]">
          <span className="text-[#c4973e] text-[5px] leading-none">✓</span>
        </span>
      )}
    </div>
  )
}

/**
 * Ecrã de atribuição de motorista, desenhado a partir do mockup: a reserva em
 * cima, dois motoristas em baixo com o escolhido em dourado, e o botão cheio.
 */
function PhoneStep2({ tNav }: { tNav: (k: string) => string }) {
  return (
    <MiniPhoneShell time="09:42" barraDeEstado={false}>
      <div className="flex items-center justify-between gap-1 px-[6px] pb-[4px] pt-[3px]">
        <span className="flex items-center gap-[3px] min-w-0">
          <span className="bg-[#c4973e] rounded-full size-[3px] shrink-0" />
          <span
            className="text-[8px] text-white leading-none truncate"
            style={SERIF_FONT}
          >
            {tNav("step2Title")}
          </span>
        </span>
        <span
          className="text-[5px] text-[rgba(255,255,255,0.45)] leading-none shrink-0"
          style={SANS_FONT}
        >
          09:42
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[4px] px-[6px] pb-[4px] min-h-0">
        <div className="flex flex-col gap-[2px] border-b border-[rgba(255,255,255,0.08)] pb-[4px]">
          <span
            className="text-[#c4973e] text-[4px] font-bold uppercase tracking-[0.8px] leading-none"
            style={SANS_FONT}
          >
            {tNav("step2BookingLabel")}
          </span>
          <p
            className="text-[5.5px] text-white leading-[7.5px]"
            style={SANS_FONT}
          >
            {tNav("step1Origin")} {tNav("step1To")} {tNav("step1Dest")} ·{" "}
            {tNav("step2When")}
          </p>
        </div>

        <LinhaMotorista
          nome={tNav("step2Driver1")}
          carro={tNav("step2Car1")}
          escolhido
        />
        <LinhaMotorista
          nome={tNav("step2Driver2")}
          carro={tNav("step2Car2")}
          escolhido={false}
        />

        <div className="bg-[#c4973e] flex justify-center mt-auto py-[3.5px] px-1">
          <span
            className="text-[#111110] text-[6px] font-bold leading-none"
            style={SANS_FONT}
          >
            {tNav("step2Cta")}
          </span>
        </div>

        <p
          className="text-[4px] text-[rgba(255,255,255,0.35)] leading-[5.5px] text-center px-[2px]"
          style={SANS_FONT}
        >
          {tNav("step2Note")}
        </p>
      </div>

      {/* Traço do meio preenchido: este é o separador do meio da app. */}
      <div className="flex gap-[4px] items-center justify-center pb-[5px]">
        <span className="bg-[rgba(255,255,255,0.12)] h-[2px] rounded-[1px] w-[12px]" />
        <span className="bg-[#c4973e] h-[2px] rounded-[1px] w-[12px]" />
        <span className="bg-[rgba(255,255,255,0.12)] h-[2px] rounded-[1px] w-[12px]" />
      </div>
    </MiniPhoneShell>
  )
}

function LinhaViagem({ rota, valor }: { rota: string; valor: string }) {
  return (
    <div className="border-b border-[rgba(255,255,255,0.07)] flex gap-1 items-center justify-between py-[3px]">
      <span
        className="text-[5.5px] text-[rgba(255,255,255,0.75)] leading-none truncate"
        style={SANS_FONT}
      >
        {rota}
      </span>
      <span
        className="text-[5.5px] text-white leading-none shrink-0"
        style={SANS_FONT}
      >
        {valor}
      </span>
    </div>
  )
}

/** Caixa de número grande, dourada, das duas do topo do ecrã de pagamentos. */
function CaixaNumero({
  valor,
  prefixo,
  etiqueta,
}: {
  valor: string
  prefixo?: string
  etiqueta: string
}) {
  return (
    <div className="border border-[rgba(201,169,110,0.45)] flex-1 flex flex-col gap-[2px] justify-center p-[5px] min-w-0">
      {prefixo && (
        <span
          className="text-[#c4973e] text-[7px] leading-none"
          style={SERIF_FONT}
        >
          {prefixo}
        </span>
      )}
      <span
        className="text-[#c4973e] text-[12px] leading-none"
        style={SERIF_FONT}
      >
        {valor}
      </span>
      <span
        className="text-[4px] text-[#c4973e] font-bold uppercase tracking-[0.8px] leading-[6px]"
        style={SANS_FONT}
      >
        {etiqueta}
      </span>
    </div>
  )
}

/**
 * Ecrã de pagamentos, desenhado a partir do mockup: dois números grandes em
 * dourado, as viagens da semana com o respectivo valor, e a data do pagamento.
 */
function PhoneStep3({ tNav }: { tNav: (k: string) => string }) {
  return (
    <MiniPhoneShell time="18:05" barraDeEstado={false}>
      <div className="flex items-center justify-between gap-1 px-[6px] pb-[4px] pt-[3px]">
        <span className="flex items-center gap-[3px] min-w-0">
          <span className="bg-[#c4973e] rounded-full size-[3px] shrink-0" />
          <span
            className="text-[8px] text-white leading-none truncate"
            style={SERIF_FONT}
          >
            {tNav("step3Title")}
          </span>
        </span>
        <span
          className="text-[5px] text-[rgba(255,255,255,0.45)] leading-none shrink-0"
          style={SANS_FONT}
        >
          18:05
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-[5px] px-[6px] pb-[4px] min-h-0">
        <div className="flex gap-[5px]">
          <CaixaNumero prefixo="€" valor="540" etiqueta={tNav("step3StatWeek")} />
          <CaixaNumero valor="12" etiqueta={tNav("step3StatTrips")} />
        </div>

        <div className="flex flex-col">
          {/* Tarifário do Porto: Aveiro, Braga e Gaia, aos preços de dia. O
              total da semana são estas três mais as restantes nove viagens. */}
          <LinhaViagem rota={tNav("step3Trip1")} valor="€ 55,00" />
          <LinhaViagem rota={tNav("step3Trip2")} valor="€ 40,00" />
          <LinhaViagem rota={tNav("step3Trip3")} valor="€ 25,00" />
        </div>

        <div className="flex gap-[3px] items-baseline mt-auto">
          <span
            className="text-[4px] text-[rgba(255,255,255,0.4)] font-bold uppercase tracking-[0.8px] leading-none shrink-0"
            style={SANS_FONT}
          >
            {tNav("step3PayoutLabel")}
          </span>
          <span
            className="text-[6.5px] text-white leading-none truncate"
            style={SERIF_FONT}
          >
            {tNav("step3PayoutValue")}
          </span>
        </div>
      </div>

      {/* Último traço aceso: este é o separador da direita. */}
      <div className="flex gap-[4px] items-center justify-center pb-[5px]">
        <span className="bg-[rgba(255,255,255,0.12)] h-[2px] rounded-[1px] w-[12px]" />
        <span className="bg-[rgba(255,255,255,0.12)] h-[2px] rounded-[1px] w-[12px]" />
        <span className="bg-[#c4973e] h-[2px] rounded-[1px] w-[12px]" />
      </div>
    </MiniPhoneShell>
  )
}

/**
 * O texto dos ecrãs vive em `driversPage2.dailyOps.phone` — é lá que nasceu, e
 * mudá-lo de sítio obrigava a mexer nos seis idiomas sem ganho nenhum. As duas
 * páginas leem-no daí e passam-no aqui.
 */
export const CHAVE_TEXTO_DOS_ECRAS = "driversPage2.dailyOps.phone"

/**
 * Em ecrã pequeno o telemóvel encolheria até ao ilegível, por isso os cartões
 * mostram antes um esboço das linhas do ecrã correspondente.
 */
export function MobileSkeleton({ variant }: { variant: 1 | 2 | 3 }) {
  if (variant === 1) {
    return (
      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex justify-end">
          <div className="bg-[rgba(28,27,24,0.08)] h-2.5 w-1/2 rounded-[1px]" />
        </div>
        <div className="bg-[rgba(154,117,53,0.18)] border border-[rgba(154,117,53,0.3)] h-4 rounded-[1px]" />
        <div className="bg-[rgba(28,27,24,0.06)] h-4 rounded-[1px]" />
        <div className="bg-[rgba(28,27,24,0.06)] h-4 rounded-[1px] w-2/3" />
      </div>
    )
  }
  if (variant === 2) {
    return (
      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex gap-2">
          <div className="bg-[rgba(154,117,53,0.18)] border border-[rgba(154,117,53,0.3)] h-4 flex-1 rounded-[1px]" />
          <div className="bg-[rgba(28,27,24,0.06)] h-4 flex-1 rounded-[1px]" />
        </div>
        <div className="bg-[rgba(28,27,24,0.06)] h-4 rounded-[1px] w-1/2" />
        <div className="bg-[rgba(28,27,24,0.06)] h-4 rounded-[1px]" />
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2.5 p-5">
      <div className="flex gap-2">
        <div className="bg-[rgba(154,117,53,0.18)] h-4 flex-1 rounded-[1px]" />
        <div className="bg-[rgba(28,27,24,0.06)] h-4 flex-1 rounded-[1px]" />
        <div className="bg-[rgba(154,117,53,0.18)] h-4 flex-1 rounded-[1px]" />
      </div>
      <div className="bg-[rgba(28,27,24,0.06)] h-4 rounded-[1px]" />
      <div className="bg-[rgba(28,27,24,0.06)] h-4 rounded-[1px] w-3/4" />
    </div>
  )
}

export { PhoneStep1, PhoneStep2, PhoneStep3 }
