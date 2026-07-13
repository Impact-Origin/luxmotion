"use client"

import { useRouter } from "next/navigation"
import { VehicleForm } from "@/components/admin/vehicle-form"

export default function NewVehiclePage() {
  const router = useRouter()
  return (
    <VehicleForm onClose={() => router.push("/admin/vehicles")} />
  )
}
