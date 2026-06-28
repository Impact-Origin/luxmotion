"use client"

import { Fragment } from "react"
import { useTranslations } from "next-intl"
import { Car, Check, FileText, type LucideIcon } from "lucide-react"

const SANS_FONT = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const

const PARTNER_NAME_PLACEHOLDER = "{{PARTNER_NAME}}"

interface StatItem {
  icon: LucideIcon
  titleKey: string
  descKey: string
  templated?: boolean
}

const ITEMS: StatItem[] = [
  { icon: Check, titleKey: "card1.title", descKey: "card1.desc", templated: true },
  { icon: FileText, titleKey: "card2.title", descKey: "card2.desc" },
  { icon: Car, titleKey: "card3.title", descKey: "card3.desc" },
]

function StatCard({
  Icon,
  title,
  desc,
}: {
  Icon: LucideIcon
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-1 min-w-0 items-start gap-4 drop-shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
      <div className="size-[44px] border border-[rgba(154,117,53,0.22)] flex items-center justify-center shrink-0">
        <Icon className="size-5 text-[#a08248]" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-2 justify-center min-w-0">
        <p
          className="text-[14px] font-semibold leading-[1.3] text-[#0d0d0d]"
          style={SANS_FONT}
        >
          {title}
        </p>
        <p
          className="text-[14px] leading-[1.2] text-[#696969]"
          style={SANS_FONT}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

export function WeddingWhitelabelStats({
  partnerName = PARTNER_NAME_PLACEHOLDER,
}: {
  partnerName?: string;
}) {
  const t = useTranslations("weddingWhitelabel.stats")

  const renderTitle = (item: StatItem) =>
    item.templated
      ? t(item.titleKey, { partnerName })
      : t(item.titleKey)

  return (
    <section className="bg-[#faf7f2] border-y-[0.8px] border-[rgba(28,27,24,0.08)] px-4 md:px-[80px] py-6 md:py-[32.8px]">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-start md:justify-center gap-6 md:gap-4">
        {ITEMS.map((item, i) => (
          <Fragment key={item.titleKey}>
            {i > 0 && (
              <span
                className="hidden md:block w-px self-stretch bg-[rgba(28,27,24,0.08)] shrink-0"
                aria-hidden
              />
            )}
            <StatCard
              Icon={item.icon}
              title={renderTitle(item)}
              desc={t(item.descKey)}
            />
          </Fragment>
        ))}
      </div>
    </section>
  )
}
