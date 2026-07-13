"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { Loader2 } from "lucide-react"
import { DriverForm } from "@/components/admin/driver-form"

export default function EditDriverPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  // Drivers has no getById query on the deployed backend; reuse the existing
  // (long-deployed) drivers.list query and select the record by id.
  const drivers = useQuery(api.drivers.list)
  const driver = drivers?.find((d) => d._id === id)

  useEffect(() => {
    if (drivers && !driver) router.replace("/admin/drivers")
  }, [drivers, driver, router])

  if (!driver) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <DriverForm initialData={driver} onClose={() => router.push("/admin/drivers")} />
  )
}
