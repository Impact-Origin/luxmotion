"use client"

import { useRouter } from "next/navigation"
import { EventForm } from "@/components/admin/event-form"

export default function NewEventPage() {
  const router = useRouter()
  return (
    <EventForm onClose={() => router.push("/admin/events")} />
  )
}
