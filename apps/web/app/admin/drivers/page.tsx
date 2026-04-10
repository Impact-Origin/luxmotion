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
import { DriverForm } from "@/components/admin/driver-form"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  UserCheck,
  MapPin,
  Quote,
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

export default function AdminDriversPage() {
  const t = useTranslations("adminDrivers")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingDriver, setEditingDriver] = React.useState<any>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")

  const drivers = useQuery(api.drivers.list)
  const removeDriver = useMutation(api.drivers.remove)

  const filteredDrivers = React.useMemo(() => {
    if (!drivers) return []

    return drivers.filter((driver) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !driver.name.toLowerCase().includes(searchLower) &&
          !driver.location.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (statusFilter !== "all" && driver.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [drivers, search, statusFilter])

  const handleEdit = (driver: any) => {
    setEditingDriver(driver)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingDriver(null)
    setIsFormOpen(true)
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

  if (!drivers) {
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
          {t("addDriver")}
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

      {filteredDrivers.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <UserCheck className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noDriversFound")}</h3>
          <p className="text-zinc-500 mb-4">
            {drivers.length === 0 ? t("getStarted") : t("tryFilters")}
          </p>
          {drivers.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("createDriver")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDrivers.map((driver) => (
            <div
              key={driver._id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow group p-6 flex flex-col items-center text-center"
            >
              <div className="relative mb-3">
                <div className="size-[100px] rounded-full overflow-hidden ring-4 ring-[rgba(41,201,255,0.2)]">
                  {driver.imageUrl ? (
                    <Image
                      src={driver.imageUrl}
                      alt={driver.name}
                      width={100}
                      height={100}
                      className="object-cover size-full"
                    />
                  ) : (
                    <div className="size-full bg-zinc-100 flex items-center justify-center">
                      <UserCheck className="h-8 w-8 text-zinc-300" />
                    </div>
                  )}
                </div>

                <span
                  className={cn(
                    "absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                    getStatusBadgeClass(driver.status)
                  )}
                >
                  {t(driver.status)}
                </span>
              </div>

              <h3 className="font-bold text-[#0f1729] text-base">{driver.name}</h3>

              {driver.location && (
                <p className="text-[#29c9ff] text-sm font-medium mt-1">{driver.location}</p>
              )}

              <p className="text-[#65758b] text-sm italic mt-2 line-clamp-3 leading-[1.3]">
                &ldquo;{driver.quote}&rdquo;
              </p>

              <div className="flex items-center gap-1 mt-3 text-xs text-zinc-400">
                #{driver.order}
              </div>

              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem onClick={() => handleEdit(driver)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeletingId(driver._id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      <DriverForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingDriver(null)
        }}
        initialData={editingDriver}
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
