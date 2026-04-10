"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isTour = searchParams.get("tour") === "1"
  const [mounted, setMounted] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (isTour) return
    router.replace("/checkout?success=true")
  }, [mounted, isTour, router])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27c7ff] mx-auto" />
      </div>
    )
  }

  if (isTour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
        <div className="max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#e0f4fc] mb-6">
            <CheckCircle2 className="w-12 h-12 text-[#27c7ff]" />
          </div>
          <h1 className="text-2xl font-bold text-[#222222] mb-3">
            {t("tourCheckout.prepareForExperience")}
          </h1>
          <p className="text-[#5f686c] mb-8">
            {t("tourCheckout.emailConfirmation")}
          </p>
          <Button asChild className="bg-[#222222] hover:bg-[#333] text-white h-12 px-8 rounded-xl font-bold">
            <Link href="/">{t("tourCheckout.letsGo")}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27c7ff] mx-auto mb-4"></div>
        <p className="text-[#222222] text-lg">Processing your payment...</p>
      </div>
    </div>
  )
}
