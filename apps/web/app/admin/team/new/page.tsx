"use client"

import { useRouter } from "next/navigation"
import { TeamMemberForm } from "@/components/admin/team-member-form"

export default function NewTeamMemberPage() {
  const router = useRouter()
  return (
    <TeamMemberForm onClose={() => router.push("/admin/team")} />
  )
}
