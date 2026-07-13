"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { Loader2 } from "lucide-react"
import { TeamMemberForm } from "@/components/admin/team-member-form"

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const members = useQuery(api.teamMembers.list)
  const member = members?.find((m) => m._id === id)

  useEffect(() => {
    if (members !== undefined && !member) {
      router.replace("/admin/team")
    }
  }, [members, member, router])

  if (!member) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <TeamMemberForm initialData={member} onClose={() => router.push("/admin/team")} />
  )
}
