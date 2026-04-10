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
import { ExperienceForm } from "@/components/admin/experience-form"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  Loader2,
  Briefcase,
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
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"

export default function AdminExperiencesPage() {
  const t = useTranslations("adminExperiences")
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingExperience, setEditingExperience] = React.useState<any>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")

  const experiences = useQuery(api.pastExperiences.list)
  const removeExperience = useMutation(api.pastExperiences.remove)

  const filteredExperiences = React.useMemo(() => {
    if (!experiences) return []

    return experiences.filter((exp) => {
      if (search) {
        const searchLower = search.toLowerCase()
        if (
          !exp.title.toLowerCase().includes(searchLower) &&
          !exp.location.toLowerCase().includes(searchLower)
        ) {
          return false
        }
      }

      if (statusFilter !== "all" && exp.status !== statusFilter) {
        return false
      }

      if (categoryFilter !== "all" && exp.category !== categoryFilter) {
        return false
      }

      return true
    })
  }, [experiences, search, statusFilter, categoryFilter])

  const handleEdit = (experience: any) => {
    setEditingExperience(experience)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setEditingExperience(null)
    setIsFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    try {
      await removeExperience({ id: deletingId as any })
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

  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`)
  }

  if (!experiences) {
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
          {t("addExperience")}
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

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("allCategories")}</SelectItem>
            <SelectItem value="corporate">{t("categories.corporate")}</SelectItem>
            <SelectItem value="weddings">{t("categories.weddings")}</SelectItem>
            <SelectItem value="events">{t("categories.events")}</SelectItem>
            <SelectItem value="privateTours">{t("categories.privateTours")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <Briefcase className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noExperiencesFound")}</h3>
          <p className="text-zinc-500 mb-4">
            {experiences.length === 0 ? t("getStarted") : t("tryFilters")}
          </p>
          {experiences.length === 0 && (
            <Button onClick={handleCreate} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t("createExperience")}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48">
                {exp.imageUrl ? (
                  <Image
                    src={exp.imageUrl}
                    alt={exp.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-100 flex items-center justify-center">
                    <Briefcase className="h-12 w-12 text-zinc-300" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      getStatusBadgeClass(exp.status)
                    )}
                  >
                    {t(exp.status)}
                  </span>
                  {exp.location && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#27c7ff] text-white flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(exp)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingId(exp._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-4">
                <div className="text-xs text-zinc-500 mb-2">
                  {getCategoryLabel(exp.category)}
                </div>

                <h3 className="font-semibold text-zinc-900 line-clamp-1 mb-1">
                  {exp.title}
                </h3>

                <p className="text-sm text-zinc-500 line-clamp-2 mb-3">
                  {exp.description}
                </p>

                {exp.tags && exp.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {exp.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ExperienceForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingExperience(null)
        }}
        initialData={editingExperience}
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
