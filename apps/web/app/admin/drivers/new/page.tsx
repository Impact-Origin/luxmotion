"use client"

import { useRouter } from "next/navigation"
import { DriverForm } from "@/components/admin/driver-form"

export default function NewDriverPage() {
  const router = useRouter()
  return (
    <DriverForm onClose={() => router.push("/admin/drivers")} />
  )
}
