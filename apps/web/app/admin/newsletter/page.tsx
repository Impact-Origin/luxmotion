"use client"

import * as React from "react"
import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { Loader2, Newspaper, Copy, Download } from "lucide-react"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

type SortOption = "newest" | "oldest"

export default function AdminNewsletterPage() {
  const t = useTranslations("adminNewsletter")
  const [sortBy, setSortBy] = React.useState<SortOption>("newest")
  const subscriptions = useQuery(api.newsletterSubscriptions.list)

  const sorted = React.useMemo(() => {
    if (!subscriptions) return []
    if (sortBy === "oldest") return [...subscriptions].reverse()
    return subscriptions
  }, [subscriptions, sortBy])

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

  const downloadCSV = () => {
    if (!subscriptions) return
    const csv = ["email,subscribed_at", ...subscriptions.map((s) =>
      `${s.email},${new Date(s.createdAt).toISOString()}`
    )].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!subscriptions) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle", { count: subscriptions.length })}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={downloadCSV} disabled={subscriptions.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            {t("downloadCsv")}
          </Button>
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
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg border-2 border-dashed border-border">
          <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">{t("noSubscribers")}</h3>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t("email")}</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t("subscribed")}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((s) => (
                <tr key={s._id} className="border-b border-border last:border-b-0 hover:bg-accent">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyToClipboard(s.email)}
                      className="flex items-center gap-1.5 text-foreground hover:text-foreground group"
                    >
                      {s.email}
                      <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
