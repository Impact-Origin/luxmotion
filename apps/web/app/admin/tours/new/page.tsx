"use client"

import { useRouter } from "next/navigation"
import { TourForm } from "@/components/admin/tour-form"

export default function NewTourPage() {
  const router = useRouter()
  return (
    <TourForm
      variant="page"
      isOpen
      onClose={() => router.push("/admin/tours")}
    />
  )
}
