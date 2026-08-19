"use client"

import { useRouter } from "next/navigation"
import { CorporateExperienceForm } from "@/components/admin/corporate-experience-form"

export default function NewCorporateExperiencePage() {
  const router = useRouter()
  return (
    <CorporateExperienceForm onClose={() => router.push("/admin/corporate-experiences")} />
  )
}
