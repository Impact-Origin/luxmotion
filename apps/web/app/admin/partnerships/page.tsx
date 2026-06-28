"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { Plus, Search, MoreVertical, Trash2, ExternalLink, Settings, AlertCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { WhitelabelSwitcher } from "@/components/admin/whitelabel-switcher";

export default function PartnershipsPage() {
  const partnerships = useQuery(api.partnerships.list);
  const removePartnership = useMutation(api.partnerships.remove);
  const t = useTranslations("admin");

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPartnerships = partnerships?.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this partnership?")) {
      try {
        await removePartnership({ id });
        toast.success("Partnership removed");
      } catch {
        toast.error("Failed to remove partnership");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <WhitelabelSwitcher variant="full" partnerships={partnerships} />
        <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search partnerships"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/admin/partnerships/new" className="ml-auto">
          <Button>
            <Plus className="mr-2 size-4" />
            {t("newPartnership")}
          </Button>
        </Link>
      </div>

      {!partnerships ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredPartnerships?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <AlertCircle className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">No partnerships found</p>
          <Button variant="link" onClick={() => setSearchQuery("")} className="h-auto p-0 text-muted-foreground">
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPartnerships?.map((p) => (
            <Card key={p._id} className="overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/admin/partnerships/${p._id}`} className="min-w-0 flex-1">
                    <h3 className="truncate font-medium text-foreground transition-colors hover:text-muted-foreground">
                      {p.name}
                    </h3>
                    <p className="truncate font-mono text-sm text-muted-foreground">/{p.slug}</p>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/partnerships/${p._id}`}>
                          <Settings className="mr-2 size-4 text-muted-foreground" />
                          {t("settings")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/${p.slug}`} target="_blank">
                          <ExternalLink className="mr-2 size-4 text-muted-foreground" />
                          {t("viewLiveSite")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(p._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        {t("remove")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-5 flex -space-x-2">
                  {p.theme?.colors &&
                    Object.entries(p.theme.colors)
                      .slice(0, 4)
                      .map(([key, color]) => (
                        <div
                          key={key}
                          className="size-6 rounded-full border-2 border-card"
                          style={{ backgroundColor: color as string }}
                          title={key}
                        />
                      ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
