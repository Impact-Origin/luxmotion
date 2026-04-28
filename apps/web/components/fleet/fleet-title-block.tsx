import { useTranslations } from "next-intl"

export function FleetTitleBlock() {
  const t = useTranslations("fleetPage")

  return (
    <section className="bg-[#0d0d0d] w-full pt-[20px] md:pt-[28px] px-4 md:px-[82px]">
      <div className="flex flex-col items-center gap-3 max-w-[1280px] mx-auto">
        <h1
          className="text-center text-white text-[36px] md:text-[48px] leading-[1.2] md:leading-[1.44]"
          style={{ fontFamily: "var(--font-title), 'Cormorant Garamond', serif" }}
        >
          <span className="font-normal">{t("titleHeading")}</span>{" "}
          <span className="italic text-[#c9a96e] font-normal">{t("titleHeadingAccent")}</span>
        </h1>
        <p
          className="text-center text-[16px] md:text-[18px] leading-[1.3] text-[#999999] max-w-[640px] md:max-w-none"
          style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
        >
          {t("titleSubtitle")}
        </p>
      </div>
    </section>
  )
}
