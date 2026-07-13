"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import type { Id } from "@workspace/convex/dataModel"
import { Loader2 } from "lucide-react"
import { VehicleForm } from "@/components/admin/vehicle-form"

export default function EditVehiclePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const vehicle = useQuery(api.vehicles.getById, { id: id as Id<"vehicles"> })

  useEffect(() => {
    if (vehicle === null) router.replace("/admin/vehicles")
  }, [vehicle, router])

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <VehicleForm initialData={vehicle} onClose={() => router.push("/admin/vehicles")} />
  )
}
