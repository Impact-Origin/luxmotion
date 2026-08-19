import { setRequestLocale } from "next-intl/server"
import { DriverApplication } from "@/components/applications/driver/driver-application"

export default async function DriverApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <DriverApplication />
}
