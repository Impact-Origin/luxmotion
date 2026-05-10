"use client"

import { Check, X } from "lucide-react"
import { useTranslations } from "next-intl"

const SERIF_FONT = {
  fontFamily: "var(--font-title), 'Cormorant Garamond', serif",
} as const

const SANS_FONT = {
  fontFamily: "var(--font-sans), system-ui, sans-serif",
} as const

type CellValue =
  | { kind: "text"; value: string }
  | { kind: "icon"; type: "x" | "check" }
  | { kind: "iconText"; type: "check"; value: string }

type Row = {
  label: string
  uber: CellValue
  bolt: CellValue
  luxmotion: CellValue
}

function Cell({
  value,
  variant,
}: {
  value: CellValue
  variant: "competitor" | "luxmotion"
}) {
  const baseTextCls =
    variant === "luxmotion"
      ? "text-[12px] lg:text-[18px] font-medium uppercase text-[#A08248]"
      : "text-[14px] uppercase text-[#999]"
  const xIconCls = "size-[15px] lg:size-[18px] text-[#999]"
  const checkIconCls = "size-[15px] lg:size-[18px] text-[#A08248]"

  if (value.kind === "text") {
    return (
      <span
        className={`${baseTextCls} text-center whitespace-nowrap leading-none`}
        style={SANS_FONT}
      >
        {value.value}
      </span>
    )
  }
  if (value.kind === "icon") {
    return value.type === "x" ? (
      <X className={xIconCls} strokeWidth={2} />
    ) : (
      <Check className={checkIconCls} strokeWidth={2} />
    )
  }
  return (
    <div className="flex items-center gap-1.5 lg:gap-2">
      <Check className={checkIconCls} strokeWidth={2} />
      <span
        className={`${baseTextCls} text-center whitespace-nowrap leading-none`}
        style={SANS_FONT}
      >
        {value.value}
      </span>
    </div>
  )
}

function HighlightCell({
  children,
  withTop,
  withBottom,
}: {
  children: React.ReactNode
  withTop?: boolean
  withBottom?: boolean
}) {
  const borderCls = [
    "border-x border-[rgba(154,117,53,0.22)]",
    withTop ? "border-t border-[rgba(154,117,53,0.22)]" : "",
    withBottom ? "border-b border-[rgba(154,117,53,0.22)]" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={`relative h-full w-full flex items-center justify-center px-2 lg:px-[53px] py-3 lg:py-[15px] ${borderCls}`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[rgba(154,117,53,0.07)] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none shadow-[inset_0_0_30.5px_0_#131313]"
      />
      <div className="relative">{children}</div>
    </div>
  )
}

function CompetitorCell({
  children,
  withGradient,
}: {
  children: React.ReactNode
  withGradient?: boolean
}) {
  return (
    <div
      className={`relative h-full w-full flex items-center justify-center px-4 lg:px-[41px] py-3 lg:py-[18px] ${
        withGradient
          ? "bg-gradient-to-l from-[rgba(154,117,53,0.05)] to-[rgba(52,40,18,0)]"
          : ""
      }`}
    >
      {children}
    </div>
  )
}

function LabelCell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center px-2 w-[128px] lg:w-[200px] shrink-0">
      <span
        className="text-[14px] leading-[1.2] text-[#999] lg:whitespace-nowrap"
        style={SANS_FONT}
      >
        {children}
      </span>
    </div>
  )
}

export function EarningsComparison() {
  const t = useTranslations("driversPage.earnings")

  const rows: Row[] = [
    {
      label: t("row1Label"),
      uber: { kind: "text", value: "€ 0,30" },
      bolt: { kind: "text", value: "€ 0,30" },
      luxmotion: { kind: "text", value: "€ 0,70" },
    },
    {
      label: t("row2Label"),
      uber: { kind: "text", value: "€ 0,30" },
      bolt: { kind: "text", value: "€ 0,30" },
      luxmotion: { kind: "text", value: "€ 0,90" },
    },
    {
      label: t("row3Label"),
      uber: { kind: "icon", type: "x" },
      bolt: { kind: "icon", type: "x" },
      luxmotion: { kind: "iconText", type: "check", value: t("row3LuxValue") },
    },
    {
      label: t("row4Label"),
      uber: { kind: "text", value: t("variable") },
      bolt: { kind: "text", value: t("variable") },
      luxmotion: { kind: "iconText", type: "check", value: t("row4LuxValue") },
    },
    {
      label: t("row5Label"),
      uber: { kind: "icon", type: "x" },
      bolt: { kind: "icon", type: "x" },
      luxmotion: { kind: "iconText", type: "check", value: t("row5LuxValue") },
    },
    {
      label: t("row6Label"),
      uber: { kind: "text", value: t("few") },
      bolt: { kind: "text", value: t("few") },
      luxmotion: { kind: "iconText", type: "check", value: t("row6LuxValue") },
    },
  ]

  const colCls = "w-[71px] lg:w-[125px] shrink-0 self-stretch"
  const luxColCls = "w-[126px] lg:w-[220px] shrink-0 self-stretch"
  const rowDividerCls = "border-b border-[rgba(255,255,255,0.12)]"

  return (
    <section className="relative bg-[#111110] py-14 lg:py-[56px] px-4 lg:px-[82px]">
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9A7535] to-transparent"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-[rgba(201,169,110,0.12)]"
      />

      <div className="max-w-[1280px] mx-auto flex flex-col gap-12 lg:gap-0 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-2.5 w-full lg:w-[379px] shrink-0">
          <p
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E] leading-none"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </p>
          <h2
            className="text-white font-light text-[48px] leading-none"
            style={SERIF_FONT}
          >
            <span className="block">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
            <span className="block italic text-[#C4973E]">{t("titleAccent")}</span>
          </h2>
          <p
            className="text-[14px] leading-[1.2] text-[#999] pt-1"
            style={SANS_FONT}
          >
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col items-end w-full lg:w-[850px] shrink-0">
          <div className={`flex h-[48px] lg:h-[57px] items-stretch ${rowDividerCls}`}>
            <div className="w-[128px] lg:w-[200px] shrink-0" />
            <div className={colCls}>
              <div className="h-full flex items-center justify-center">
                <span
                  className="text-[14px] font-bold uppercase tracking-[1.44px] text-[#999]"
                  style={SANS_FONT}
                >
                  Uber
                </span>
              </div>
            </div>
            <div className={colCls}>
              <div className="h-full flex items-center justify-center">
                <span
                  className="text-[14px] font-bold uppercase tracking-[1.44px] text-[#999]"
                  style={SANS_FONT}
                >
                  Bolt
                </span>
              </div>
            </div>
            <div className={luxColCls}>
              <HighlightCell withTop>
                <span
                  className="text-[14px] lg:text-[18px] font-light text-[#C9A96E] uppercase tracking-[3px] lg:tracking-[4px] whitespace-nowrap"
                  style={SERIF_FONT}
                >
                  LuxMotion
                </span>
              </HighlightCell>
            </div>
          </div>

          {rows.map((row, i) => {
            const isLast = i === rows.length - 1
            return (
              <div
                key={i}
                className={`flex h-[46px] lg:h-[54px] items-stretch ${isLast ? "" : rowDividerCls}`}
              >
                <LabelCell>{row.label}</LabelCell>
                <div className={colCls}>
                  <CompetitorCell>
                    <Cell value={row.uber} variant="competitor" />
                  </CompetitorCell>
                </div>
                <div className={colCls}>
                  <CompetitorCell withGradient>
                    <Cell value={row.bolt} variant="competitor" />
                  </CompetitorCell>
                </div>
                <div className={luxColCls}>
                  <HighlightCell withBottom={isLast}>
                    <Cell value={row.luxmotion} variant="luxmotion" />
                  </HighlightCell>
                </div>
              </div>
            )
          })}

          <p
            className="mt-2 text-[10px] lg:text-[12px] text-[#696969] text-right pr-2"
            style={SANS_FONT}
          >
            {t("footnote")}
          </p>
        </div>
      </div>
    </section>
  )
}
