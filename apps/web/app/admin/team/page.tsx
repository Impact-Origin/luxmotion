"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { TeamMemberForm } from "@/components/admin/team-member-form"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  Users,
} from "lucide-react"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog"
import { toast } from "sonner"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

export default function AdminTeamPage() {
  const t = useTranslations("adminTeam")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingMember, setEditingMember] = React.useState<any>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const members = useQuery(api.teamMembers.list)
  const removeMember = useMutation(api.teamMembers.remove)

  const filteredMembers = React.useMemo(() => {
    if (!members) return []

    return members.filter((member) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !member.name.toLowerCase().includes(searchLower) &&
          !member.role.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (statusFilter !== "all" && member.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [members, search, statusFilter])

  const handleEdit = (member: any) => {
    setEditingMember(member)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingMember(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await removeMember({ id: deletingId as any })
      toast.success(t("deleteSuccess"))
    } catch (error) {
      toast.error(t("deleteError"))
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-zinc-100 text-zinc-800"
      default:
        return "bg-zinc-100 text-zinc-800"
    }
  }

  if (!members) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{t("title")}</h1>
          <p className="text-zinc-500 mt-1">{t("subtitle")}</p>
        </div>
        <Button onClick={handleCreate} className="bg-zinc-900 text-white hover:bg-zinc-800">
          <Plus className="h-4 w-4 mr-2" />
          {t("addMember")}
        </Button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allStatus")}</SelectItem>
            <SelectItem value="published">{t("published")}</SelectItem>
            <SelectItem value="draft">{t("draft")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredMembers.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <Users className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noMembersFound")}</h3>
          <p className="text-zinc-500 mb-4">
            {members.length === 0 ? t("getStarted") : t("tryFilters")}
          </p>
          {members.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("createMember")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-[3/4]">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="size-full bg-zinc-100 flex items-center justify-center">
                    <Users className="h-12 w-12 text-zinc-300" />
                  </div>
                )}
                <span
                  className={cn(
                    "absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium",
                    getStatusBadgeClass(member.status)
                  )}
                >
                  {t(member.status)}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-[#0f1729] text-base">{member.name}</h3>
                {member.role && (
                  <p className="text-[#65758b] text-sm mt-0.5">{member.role}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-zinc-400">#{member.order}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(member)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeletingId(member._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TeamMemberForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingMember(null)
        }}
        initialData={editingMember}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
