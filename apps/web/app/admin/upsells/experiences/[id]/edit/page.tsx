"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { UpsellExperienceForm } from "@/components/admin/upsell-experience-form"

export default function EditUpsellExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const experience = useQuery(api.upsells.getExperience, {
    id: id as Id<"upsellExperiences">,
  })

  useEffect(() => {
    if (experience === null) router.replace("/admin/upsells?tab=experiences")
  }, [experience, router])

  if (!experience) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <UpsellExperienceForm
      initialData={experience}
      onClose={() => router.push("/admin/upsells?tab=experiences")}
    />
  )
}
