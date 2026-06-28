"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { Plus, MoreVertical, Trash2, ExternalLink, Settings, Building2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { WhitelabelSwitcher } from "@/components/admin/whitelabel-switcher";
import { DataTable, type DataTableQuery } from "@/components/admin/data-table";

export default function PartnershipsPage() {
  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} });
  const res = useQuery(api.partnerships.listPaged, tableQuery);
  const partnerships = useQuery(api.partnerships.list);
  const removePartnership = useMutation(api.partnerships.remove);
  const t = useTranslations("admin");

  type Row = NonNullable<typeof res>["rows"][number];

  const handleDelete = async (id: Row["_id"]) => {
    if (confirm("Are you sure you want to delete this partnership?")) {
      try {
        await removePartnership({ id });
        toast.success("Partnership removed");
      } catch {
        toast.error("Failed to remove partnership");
      }
    }
  };

  const renderCard = (p: Row) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col gap-3 p-5">
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

        <div className="mt-2 flex -space-x-2">
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
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <WhitelabelSwitcher variant="full" partnerships={partnerships} />

      <DataTable<Row>
        mode="server"
        views={["card"]}
        defaultView="card"
        renderCard={renderCard}
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        searchKeys={["name"]}
        searchPlaceholder="Search partnerships"
        columns={[]}
        toolbarActions={
          <Link href="/admin/partnerships/new">
            <Button>
              <Plus className="mr-2 size-4" />
              {t("newPartnership")}
            </Button>
          </Link>
        }
        emptyTitle="No partnerships found"
        emptyDescription="Create a partnership or adjust your search."
        emptyIcon={Building2}
      />
    </div>
  );
}
