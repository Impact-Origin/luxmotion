"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { XCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function PaymentErrorPage() {
  const searchParams = useSearchParams()
  const isTour = searchParams.get("tour") === "1"
  const t = useTranslations()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-[#222222] mb-2">
          {isTour ? t("tourCheckout.paymentRejected") : t("payment.paymentError")}
        </h1>
        <p className="text-[#5f686c] mb-8 text-sm">
          {isTour
            ? t("tourCheckout.paymentRejected")
            : t("payment.paymentError")}
        </p>
        <Button asChild className="bg-[#222222] hover:bg-[#333] text-white h-12 px-8 rounded-xl font-bold">
          <Link href="/">{t("common.continue")}</Link>
        </Button>
      </div>
    </div>
  )
}
