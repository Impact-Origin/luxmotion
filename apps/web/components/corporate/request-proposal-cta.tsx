import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

const sans = { fontFamily: "var(--font-sans), system-ui, sans-serif" } as const
const serif = { fontFamily: "var(--font-title), 'Cormorant Garamond', serif" } as const

const BRIEF_HREF = "/corporate/contact#request-quote"

export function RequestProposalCta() {
  const t = useTranslations("corporatePage.contact.proposalCta")

  return (
    <section className="w-full bg-[#0D0D0D] px-4 py-12 md:px-[82px] md:py-16 2xl:px-[300px]">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 max-w-[82px] bg-[#C9A96E]" />
            <p
              className="text-[12px] font-semibold uppercase tracking-[2px] text-[#C9A96E]"
              style={sans}
            >
              {t("eyebrow")}
            </p>
          </div>

          <h2 className="text-[36px] leading-none text-[#F5F5F5] md:text-[48px]" style={serif}>
            {t("titleLine1")} <span className="italic text-[#C9A96E]">{t("titleAccent")}</span>.
          </h2>
        </div>

        <Link
          href={BRIEF_HREF}
          className="group inline-flex h-12 shrink-0 items-center gap-2 border border-[#C9A96E] px-6 text-[12px] font-semibold uppercase tracking-[1.2px] text-[#C9A96E] transition-colors hover:bg-[#C9A96E] hover:text-[#0D0D0D]"
          style={sans}
        >
          {t("cta")}
          <ArrowRight className="size-[14px] transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </Link>
      </div>
    </section>
  )
}
