"use client"

import { useRouter } from "next/navigation"
import { ExperienceForm } from "@/components/admin/experience-form"

export default function NewExperiencePage() {
  const router = useRouter()
  return (
    <ExperienceForm onClose={() => router.push("/admin/experiences")} />
  )
}
