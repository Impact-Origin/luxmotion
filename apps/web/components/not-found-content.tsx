"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

export function NotFoundContent() {
  const t = useTranslations("notFound")

  return (
    <main className="flex-1 flex flex-col items-center justify-center pt-[60px] pb-12 px-4">
      <Image
        src="/svgs/404_error.svg"
        alt="404"
        width={600}
        height={500}
        className="w-[320px] md:w-[480px] lg:w-[600px] h-auto"
        priority
      />

      <Link
        href="/"
        className="group mt-6 md:mt-10 bg-[#27c7ff] hover:bg-[#20b8ef] text-white pl-8 pr-6 py-4 flex items-center gap-2 rounded-2xl shadow-[0px_4px_8px_rgba(0,0,0,0.1),0px_18px_20px_rgba(0,0,0,0.05)] transition-colors uppercase text-[14px] md:text-[16px] font-bold tracking-[0.16px]"
      >
        {t("backToHomepage")}
        <ArrowUpRight className="size-5" />
      </Link>
    </main>
  )
}
