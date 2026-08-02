"use client"

import { useRouter } from "next/navigation"
import { UpsellExperienceForm } from "@/components/admin/upsell-experience-form"

export default function NewUpsellExperiencePage() {
  const router = useRouter()
  return <UpsellExperienceForm onClose={() => router.push("/admin/upsells?tab=experiences")} />
}
