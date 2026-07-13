"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { TourForm } from "@/components/admin/tour-form"

export default function EditTourPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const tour = useQuery(api.tours.getById, { id: id as Id<"tours"> })

  useEffect(() => {
    if (tour === null) router.replace("/admin/tours")
  }, [tour, router])

  if (!tour) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <TourForm
      variant="page"
      isOpen
      initialData={tour}
      onClose={() => router.push("/admin/tours")}
    />
  )
}
