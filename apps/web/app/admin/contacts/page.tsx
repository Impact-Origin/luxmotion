"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { Loader2, Mail, Copy } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"

type SortOption = "newest" | "oldest"

export default function AdminContactsPage() {
  const t = useTranslations("adminContacts")
  const [sortBy, setSortBy] = React.useState<SortOption>("newest")
  const [selectedMessage, setSelectedMessage] = React.useState<{ name: string; message: string } | null>(null)
  const submissions = useQuery(api.contactSubmissions.list)

  const sorted = React.useMemo(() => {
    if (!submissions) return []
    if (sortBy === "oldest") return [...submissions].reverse()
    return submissions
  }, [submissions, sortBy])

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success(t("copied"))
  }

  if (!submissions) {
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
          <p className="text-zinc-500 mt-1">{t("subtitle", { count: submissions.length })}</p>
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sortNewest")}</SelectItem>
            <SelectItem value="oldest">{t("sortOldest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 bg-zinc-50 rounded-lg border-2 border-dashed border-zinc-200">
          <Mail className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">{t("noSubmissions")}</h3>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">{t("name")}</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">{t("email")}</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">{t("phone")}</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">{t("message")}</th>
                <th className="text-left px-4 py-3 font-medium text-zinc-500">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s._id} className="border-b last:border-b-0 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{s.name}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyToClipboard(s.email)}
                      className="flex items-center gap-1.5 text-zinc-700 hover:text-zinc-900 group"
                    >
                      {s.email}
                      <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {s.phone ? (
                      <button
                        onClick={() => copyToClipboard(s.phone!)}
                        className="flex items-center gap-1.5 text-zinc-700 hover:text-zinc-900 group"
                      >
                        {s.phone}
                        <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ) : (
                      <span className="text-zinc-400">{t("noPhone")}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 max-w-[300px]">
                    <button
                      onClick={() => setSelectedMessage({ name: s.name, message: s.message })}
                      className="text-left truncate block w-full hover:text-zinc-900 transition-colors"
                    >
                      {s.message}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent showCloseButton={false} className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-zinc-700 whitespace-pre-wrap break-words mt-4">{selectedMessage?.message}</p>
          <DialogClose asChild>
            <Button variant="outline" className="mt-2 w-full">{t("close")}</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}
