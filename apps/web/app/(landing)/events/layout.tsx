import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { createPageMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("eventsPage")

  return createPageMetadata({
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    path: "/events",
    image: "/tours_hero.webp",
    keywords: ["events Portugal", "festivals Portugal", "private event transport"],
  })
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
