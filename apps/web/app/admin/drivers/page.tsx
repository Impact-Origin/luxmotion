"use client"

import * as React from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import { StatusBadge } from "@/components/admin/status-badge"
import { DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table"
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  UserCheck,
  MapPin,
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
import Image from "next/image"

export default function AdminDriversPage() {
  const t = useTranslations("adminDrivers")
  const router = useRouter()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} })
  const res = useQuery(api.drivers.listPaged, tableQuery)
  const removeDriver = useMutation(api.drivers.remove)

  type Driver = NonNullable<typeof res>["rows"][number]

  const handleEdit = (driver: Driver) => {
    router.push(`/admin/drivers/${driver._id}/edit`)
  }

  const handleCreate = () => {
    router.push("/admin/drivers/new")
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await removeDriver({ id: deletingId as any })
      toast.success(t("deleteSuccess"))
    } catch (error) {
      toast.error(t("deleteError"))
    } finally {
      setDeletingId(null)
    }
  }

  const rowActions = (driver: Driver) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleEdit(driver)}>
          <Pencil className="mr-2 size-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setDeletingId(driver._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  const columns: DataTableColumn<Driver>[] = [
    {
      id: "name",
      header: t("title"),
      sortAccessor: (d) => d.name.toLowerCase(),
      cell: (d) => (
        <div className="flex items-center gap-3">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
            {d.imageUrl ? (
              <Image src={d.imageUrl} alt={d.name} fill className="object-cover" />
            ) : (
              <UserCheck className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <span className="font-medium text-foreground">{d.name}</span>
            {d.location && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {d.location}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "quote",
      header: "Quote",
      cell: (d) => (
        <p className="max-w-md truncate text-sm italic text-muted-foreground">
          &ldquo;{d.quote}&rdquo;
        </p>
      ),
    },
    {
      id: "status",
      header: t("status"),
      cell: (d) => <StatusBadge status={d.status} label={t(d.status)} />,
    },
    {
      id: "order",
      header: "Order",
      align: "right",
      sortAccessor: (d) => d.order,
      cell: (d) => <span className="tabular-nums text-muted-foreground">#{d.order}</span>,
    },
  ]

  const filters: DataTableFilter<Driver>[] = [
    {
      id: "status",
      label: t("allStatus"),
      width: "w-[140px]",
      options: [
        { value: "published", label: t("published") },
        { value: "draft", label: t("draft") },
      ],
      predicate: (d, val) => d.status === val,
    },
  ]

  const renderCard = (driver: Driver) => (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center">
      <div className="relative size-[100px] shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {driver.imageUrl ? (
          <Image src={driver.imageUrl} alt={driver.name} fill className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center">
            <UserCheck className="size-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div>
        <h3 className="font-medium text-foreground">{driver.name}</h3>
        {driver.location && (
          <p className="mt-0.5 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3" />
            {driver.location}
          </p>
        )}
      </div>
      <p className="line-clamp-3 text-sm italic leading-snug text-muted-foreground">
        &ldquo;{driver.quote}&rdquo;
      </p>
      <div className="mt-auto flex w-full items-center justify-between border-t border-border pt-3">
        <StatusBadge status={driver.status} label={t(driver.status)} />
        {rowActions(driver)}
      </div>
    </div>
  )

  return (
    <>
      <DataTable<Driver>
        mode="server"
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        columns={columns}
        searchKeys={["name", "location"]}
        searchPlaceholder={t("searchPlaceholder")}
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        initialSort={{ columnId: "order", dir: "asc" }}
        toolbarActions={
          <Button onClick={handleCreate}>
            <Plus className="mr-2 size-4" />
            {t("addDriver")}
          </Button>
        }
        emptyTitle={t("noDriversFound")}
        emptyDescription={t("tryFilters")}
        emptyIcon={UserCheck}
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
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
