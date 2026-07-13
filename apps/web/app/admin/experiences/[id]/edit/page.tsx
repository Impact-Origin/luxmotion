"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { Loader2 } from "lucide-react"
import { ExperienceForm } from "@/components/admin/experience-form"

export default function EditExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const experiences = useQuery(api.pastExperiences.list)
  const experience = experiences?.find((e) => e._id === id)

  useEffect(() => {
    if (experiences !== undefined && !experience) {
      router.replace("/admin/experiences")
    }
  }, [experiences, experience, router])

  if (!experience) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <ExperienceForm initialData={experience} onClose={() => router.push("/admin/experiences")} />
  )
}
