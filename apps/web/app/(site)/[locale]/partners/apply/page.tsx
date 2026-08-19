import { setRequestLocale } from "next-intl/server"
import { PartnerApplication } from "@/components/applications/partner/partner-application"

export default async function PartnerApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <PartnerApplication />
}
