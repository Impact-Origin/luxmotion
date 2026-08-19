"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { EventForm } from "@/components/admin/event-form"

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const event = useQuery(api.events.getById, { id: id as Id<"events"> })

  useEffect(() => {
    if (event === null) router.replace("/admin/events")
  }, [event, router])

  if (!event) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <EventForm initialData={event} onClose={() => router.push("/admin/events")} />
  )
}
