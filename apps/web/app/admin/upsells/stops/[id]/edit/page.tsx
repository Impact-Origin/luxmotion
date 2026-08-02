"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { UpsellStopForm } from "@/components/admin/upsell-stop-form"

export default function EditUpsellStopPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const stop = useQuery(api.upsells.getStop, { id: id as Id<"upsellStops"> })

  useEffect(() => {
    if (stop === null) router.replace("/admin/upsells")
  }, [stop, router])

  if (!stop) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <UpsellStopForm initialData={stop} onClose={() => router.push("/admin/upsells")} />
}
