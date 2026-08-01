"use client"

import { useTranslations } from "next-intl"

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
}: {
  children: React.ReactNode
  time: string
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
        <div className="flex h-4 items-center justify-end pb-0.5 pt-2.5 px-1.5">
          <span
            className="text-[5px] text-[rgba(255,255,255,0.3)] leading-none"
            style={SANS_FONT}
          >
            {time}
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

function MiniHeader({ title }: { title: string }) {
  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between pb-1.5 pt-1 px-1.5">
      <span
        className="text-[9px] text-white leading-none"
        style={SERIF_FONT}
      >
        {title}
      </span>
      <span className="bg-[rgba(201,169,110,0.5)] rounded-[2.5px] size-[5px]" />
    </div>
  )
}

function MiniNav({ items }: { items: { label: string; active: boolean }[] }) {
  return (
    <div className="border-t border-[rgba(255,255,255,0.05)] flex gap-[3px] h-[18.64px] items-start justify-center pb-1 pt-[4.64px] px-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-px w-[25px]">
          <span
            className={`h-1 rounded-[1px] w-3 ${
              item.active ? "bg-[rgba(201,169,110,0.4)]" : "bg-[rgba(255,255,255,0.08)]"
            }`}
          />
          {item.active && (
            <span
              className="text-[4px] text-[rgba(255,255,255,0.2)] leading-none"
              style={SANS_FONT}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function PhoneStep1({ tNav }: { tNav: (k: string) => string }) {
  return (
    <MiniPhoneShell time="9:41">
      <MiniHeader title={tNav("step1Title")} />
      <div className="flex flex-1 flex-col gap-[3px] p-[5px] min-h-0">
        <div className="bg-[rgba(201,169,110,0.06)] border border-[rgba(201,169,110,0.3)] flex flex-col p-[5.64px] rounded-[2px]">
          <span
            className="text-[#c4973e] text-[8px] font-extrabold text-right leading-none"
            style={SANS_FONT}
          >
            € 47,00
          </span>
          <p
            className="text-[6px] text-[rgba(255,255,255,0.5)] leading-[8.4px] pb-[3px]"
            style={SANS_FONT}
          >
            <span className="font-bold">Aeroporto</span>
            <span> → Bairro Alto</span>
          </p>
          <div className="bg-[#c4973e] rounded-[1px] flex justify-center py-[2px] px-1">
            <span
              className="text-[#111110] text-[6px] font-extrabold tracking-[0.3px] leading-none"
              style={SANS_FONT}
            >
              {tNav("step1Cta")}
            </span>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] p-[5.64px] rounded-[2px] flex flex-col gap-px">
          <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[55.8px]" />
          <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[41.85px]" />
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] p-[5.64px] rounded-[2px] flex flex-col gap-px">
          <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[41.85px]" />
          <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[31.39px]" />
        </div>
      </div>
      <MiniNav
        items={[
          { label: tNav("step1Title"), active: true },
          { label: tNav("step2NavMap"), active: false },
          { label: tNav("step3Title"), active: false },
        ]}
      />
    </MiniPhoneShell>
  )
}

function PhoneStep2({ tNav }: { tNav: (k: string) => string }) {
  return (
    <MiniPhoneShell time="11:28">
      <MiniHeader title={tNav("step2Title")} />
      <div className="flex flex-1 flex-col gap-[3px] p-[5px] min-h-0">
        <div className="bg-[rgba(201,169,110,0.3)] h-[6px] rounded-[1px] w-[48.62px]" />
        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.07)] flex flex-col gap-[3px] p-[6.64px] rounded-[2px]">
          <p
            className="text-[6px] text-[rgba(255,255,255,0.5)] leading-[8.4px]"
            style={SANS_FONT}
          >
            <span className="font-bold">Francisca R.</span>
            <span> · 2 {tNav("step2Pax")}</span>
          </p>
          <div className="flex gap-1">
            <div className="bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.25)] flex-1 h-4 rounded-[1px]" />
            <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] flex-1 h-4 rounded-[1px]" />
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[64.83px]" />
        <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[36.46px]" />
        <div className="bg-[rgba(201,169,110,0.2)] flex flex-col items-center p-1 rounded-[2px] mt-[3px]">
          <span
            className="text-[#c4973e] text-[7px] font-extrabold tracking-[0.35px] leading-none text-center"
            style={SANS_FONT}
          >
            {tNav("step2Cta1")}
            <br />
            {tNav("step2Cta2")}
          </span>
        </div>
      </div>
      <MiniNav
        items={[
          { label: "", active: false },
          { label: tNav("step2NavCurrent"), active: true },
          { label: "", active: false },
        ]}
      />
    </MiniPhoneShell>
  )
}

function PhoneStep3({ tNav }: { tNav: (k: string) => string }) {
  return (
    <MiniPhoneShell time="18:05">
      <MiniHeader title={tNav("step3Title")} />
      <div className="flex flex-1 flex-col gap-[3px] p-[5px] min-h-0">
        <div className="flex gap-[3px] h-[26.28px]">
          <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex-1 flex flex-col items-center p-[4.64px] rounded-[2px]">
            <span
              className="text-[#c4973e] text-[9px] font-extrabold leading-none"
              style={SANS_FONT}
            >
              €234
            </span>
            <span
              className="text-[5px] text-[rgba(255,255,255,0.3)] tracking-[0.3px] uppercase leading-none"
              style={SANS_FONT}
            >
              {tNav("step3StatWeek")}
            </span>
          </div>
          <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex-1 flex flex-col items-center p-[4.64px] rounded-[2px]">
            <span
              className="text-[#c4973e] text-[9px] font-extrabold leading-none"
              style={SANS_FONT}
            >
              8
            </span>
            <span
              className="text-[5px] text-[rgba(255,255,255,0.3)] tracking-[0.3px] uppercase leading-none"
              style={SANS_FONT}
            >
              {tNav("step3StatTrips")}
            </span>
          </div>
        </div>
        <div className="h-1" />
        <div className="bg-[rgba(201,169,110,0.3)] h-[7px] rounded-[1px] w-[64.83px]" />
        <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[48.62px]" />
        <div className="bg-[rgba(255,255,255,0.08)] h-[5px] rounded-[1px] w-[64.83px]" />
        <div className="bg-[rgba(201,169,110,0.2)] h-[5px] rounded-[1px] w-[36.46px]" />
        <div className="flex justify-end pt-0.5">
          <span
            className="text-[7px] text-[rgba(255,255,255,0.3)] leading-none"
            style={SANS_FONT}
          >
            {tNav("step3Payday")}
          </span>
        </div>
      </div>
      <MiniNav
        items={[
          { label: "", active: false },
          { label: "", active: false },
          { label: tNav("step3Title"), active: true },
        ]}
      />
    </MiniPhoneShell>
  )
}

function MobileSkeleton({ variant }: { variant: 1 | 2 | 3 }) {
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

function StepCard({
  num,
  variant,
  phone,
  headingPre,
  headingAccent,
  headingPost,
  body,
}: {
  num: string
  variant: 1 | 2 | 3
  phone: React.ReactNode
  headingPre: string
  headingAccent: string
  headingPost?: string
  body: string
}) {
  return (
    <div className="group bg-white border border-[rgba(28,27,24,0.08)] flex flex-col flex-1 min-w-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[rgba(154,117,53,0.35)] hover:shadow-[0_18px_40px_-16px_rgba(28,27,24,0.28)]">
      <div className="relative bg-[#F4EFE6] border-b border-[rgba(28,27,24,0.08)] h-[230px] lg:h-[320px]">
        {/* O telemóvel é desenhado em px fixos e minúsculos, por isso cresce por
            escala — assim o ecrã inteiro aumenta em proporção, sem mexer em
            nenhuma das medidas internas. */}
        <div className="hidden lg:flex h-full items-center justify-center transition-transform duration-300 ease-out scale-[1.32] group-hover:scale-[1.39]">
          {phone}
        </div>
        <div className="flex lg:hidden h-full">
          <MobileSkeleton variant={variant} />
        </div>
        <div className="absolute bg-[#111110] left-3.5 top-3.5 rounded-full size-9 flex items-center justify-center">
          <span
            className="text-[#c4973e] text-[16px] font-semibold leading-none"
            style={SERIF_FONT}
          >
            {num}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-[9px] pt-7 pb-8 px-7">
        <h3
          className="text-[22px] text-[#1C1B18] leading-normal"
          style={SERIF_FONT}
        >
          {headingPre}{" "}
          <span className="italic text-[#9A7535]">{headingAccent}</span>
          {headingPost && <> {headingPost}</>}
        </h3>
        <p
          className="text-[16px] leading-[24px] text-[rgba(28,27,24,0.62)]"
          style={SANS_FONT}
        >
          {body}
        </p>
      </div>
    </div>
  )
}

export function DailyOps2() {
  const t = useTranslations("driversPage2.dailyOps")
  const tNav = useTranslations("driversPage2.dailyOps.phone")

  return (
    <section id="how-it-works" className="scroll-mt-[72px] bg-[#F7F4EF] px-4 lg:px-[82px] py-16 lg:py-24">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-center gap-2">
          <div className="h-px w-[82px] bg-[#9A7535]" />
          <span
            className="text-[12px] font-semibold uppercase tracking-[2px] text-[#9A7535] leading-none whitespace-nowrap"
            style={SANS_FONT}
          >
            {t("eyebrow")}
          </span>
        </div>

        <h2
          className="mt-3 text-[32px] lg:text-[44px] leading-[1.2] font-light text-[#1C1B18]"
          style={SERIF_FONT}
        >
          {t("titleStart")}
          <br />
          {t("titlePre")}{" "}
          <span className="italic text-[#9A7535]">{t("titleAccent")}</span>
        </h2>

        <p
          className="mt-3 text-[14px] leading-[1.2] text-[#696969] max-w-[480px]"
          style={SANS_FONT}
        >
          {t("subtitle")}
        </p>

        <div className="flex flex-col lg:flex-row gap-3 lg:gap-[2.3px] mt-11">
          <StepCard
            num="1"
            variant={1}
            phone={<PhoneStep1 tNav={tNav} />}
            headingPre={t("step1.headingPre")}
            headingAccent={t("step1.headingAccent")}
            body={t("step1.body")}
          />
          <StepCard
            num="2"
            variant={2}
            phone={<PhoneStep2 tNav={tNav} />}
            headingPre={t("step2.headingPre")}
            headingAccent={t("step2.headingAccent")}
            headingPost={t("step2.headingPost")}
            body={t("step2.body")}
          />
          <StepCard
            num="3"
            variant={3}
            phone={<PhoneStep3 tNav={tNav} />}
            headingPre={t("step3.headingPre")}
            headingAccent={t("step3.headingAccent")}
            body={t("step3.body")}
          />
        </div>
      </div>
    </section>
  )
}
