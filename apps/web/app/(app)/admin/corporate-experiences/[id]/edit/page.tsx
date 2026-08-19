"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { CorporateExperienceForm } from "@/components/admin/corporate-experience-form"

export default function EditCorporateExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const experience = useQuery(api.corporateExperiences.get, {
    id: id as Id<"corporateExperiences">,
  })

  useEffect(() => {
    if (experience === null) router.replace("/admin/corporate-experiences")
  }, [experience, router])

  if (!experience) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <CorporateExperienceForm
      initialData={experience}
      onClose={() => router.push("/admin/corporate-experiences")}
    />
  )
}
