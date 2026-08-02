"use client"

import { useRouter } from "next/navigation"
import { UpsellStopForm } from "@/components/admin/upsell-stop-form"

export default function NewUpsellStopPage() {
  const router = useRouter()
  return <UpsellStopForm onClose={() => router.push("/admin/upsells")} />
}
