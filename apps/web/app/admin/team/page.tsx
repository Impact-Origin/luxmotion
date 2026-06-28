"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { Button } from "@workspace/ui/components/button"
import { TeamMemberForm } from "@/components/admin/team-member-form"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/admin/data-table"
import { Plus, Pencil, Trash2, MoreHorizontal, Users } from "lucide-react"
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
import Image from "next/image"

export default function AdminTeamPage() {
  const t = useTranslations("adminTeam")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingMember, setEditingMember] = React.useState<any>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const members = useQuery(api.teamMembers.list)
  const removeMember = useMutation(api.teamMembers.remove)

  type Member = NonNullable<typeof members>[number]

  const handleEdit = (member: Member) => {
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

  const rowActions = (member: Member) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleEdit(member)}>
          <Pencil className="mr-2 size-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletingId(member._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const columns: DataTableColumn<Member>[] = [
    {
      id: "name",
      header: "Member",
      sortAccessor: (m) => m.name.toLowerCase(),
      cell: (m) => (
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {m.imageUrl ? (
              <Image src={m.imageUrl} alt={m.name} fill className="object-cover" />
            ) : (
              <Users className="size-4 text-muted-foreground" />
            )}
          </div>
          <span className="font-medium text-foreground">{m.name}</span>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      sortAccessor: (m) => (m.role ?? "").toLowerCase(),
      cell: (m) =>
        m.role ? (
          <span className="text-sm text-foreground">{m.role}</span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
    {
      id: "status",
      header: "Status",
      cell: (m) => <StatusBadge status={m.status} label={t(m.status)} />,
    },
    {
      id: "order",
      header: "Order",
      align: "right",
      sortAccessor: (m) => m.order,
      cell: (m) => <span className="tabular-nums text-muted-foreground">#{m.order}</span>,
    },
  ]

  const filters: DataTableFilter<Member>[] = [
    {
      id: "status",
      label: t("allStatus"),
      width: "w-[140px]",
      options: [
        { value: "published", label: t("published") },
        { value: "draft", label: t("draft") },
      ],
      predicate: (m, val) => m.status === val,
    },
  ]

  const renderCard = (member: Member) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[3/4]">
        {member.imageUrl ? (
          <Image src={member.imageUrl} alt={member.name} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-muted">
            <Users className="size-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute right-3 top-3">
          <StatusBadge status={member.status} label={t(member.status)} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-2 p-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium text-foreground">{member.name}</h3>
          {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
          <p className="mt-2 text-xs text-muted-foreground">#{member.order}</p>
        </div>
        {rowActions(member)}
      </div>
    </div>
  )

  return (
    <>
      <DataTable<Member>
        data={members}
        columns={columns}
        searchKeys={["name", "role"]}
        searchPlaceholder={t("searchPlaceholder")}
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        initialSort={{ columnId: "order", dir: "asc" }}
        toolbarActions={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 size-4" />
            {t("addMember")}
          </Button>
        }
        emptyTitle={t("noMembersFound")}
        emptyDescription={t("tryFilters")}
        emptyIcon={Users}
      />

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
            <AlertDialogAction onClick={handleDelete}>
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
