"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api"
import { PartnershipCreateForm } from "@/components/admin/partnership-create-form"
import {
  EntityFormDialog,
  useEntityFormParams,
} from "@/components/admin/entity-form-dialog";
import { Plus, MoreVertical, Trash2, ExternalLink, Settings, Building2, BarChart3 } from "lucide-react";
import Image from "next/image";
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
import { StatusBadge } from "@/components/admin/status-badge";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
  type DataTableQuery,
} from "@/components/admin/data-table";
import { PARTNERSHIP_LANDING_TEMPLATES } from "@/lib/partnership-landing-templates";

export default function PartnershipsPage() {
  const { isNew, openNew, close } = useEntityFormParams();
  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} });
  const res = useQuery(api.partnerships.listPaged, tableQuery);
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

  const templateLabel = (p: Row) => t(`landingTemplateOptions.${p.landingTemplate ?? "transfer"}`);

  const logo = (p: Row, size: string) => (
    <span
      className={`relative flex ${size} shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted`}
    >
      {p.logoUrl ? (
        <Image src={p.logoUrl} alt="" fill className="object-contain" />
      ) : (
        <span className="text-xs font-medium text-muted-foreground">{p.name.charAt(0)}</span>
      )}
    </span>
  );

  const swatches = (p: Row) => (
    <div className="flex -space-x-1.5">
      {p.theme?.colors &&
        Object.entries(p.theme.colors)
          .slice(0, 4)
          .map(([key, color]) => (
            <span
              key={key}
              className="size-5 rounded-full border-2 border-card"
              style={{ backgroundColor: color as string }}
              title={key}
            />
          ))}
    </div>
  );

  const rowActions = (p: Row) => (
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
          <Link href={`/admin/partnerships/${p._id}/leads`}>
            <BarChart3 className="mr-2 size-4 text-muted-foreground" />
            Leads &amp; encomendas
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${p.slug}`} target="_blank">
            <ExternalLink className="mr-2 size-4 text-muted-foreground" />
            {t("viewLiveSite")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleDelete(p._id)} className="text-destructive focus:text-destructive">
          <Trash2 className="mr-2 size-4" />
          {t("remove")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const columns: DataTableColumn<Row>[] = [
    {
      id: "name",
      header: "Partnership",
      sortAccessor: (p) => p.name.toLowerCase(),
      cell: (p) => (
        <div className="flex items-center gap-3">
          {logo(p, "size-8")}
          <div className="min-w-0">
            <Link
              href={`/admin/partnerships/${p._id}`}
              className="block truncate font-medium text-foreground transition-colors hover:text-muted-foreground"
            >
              {p.name}
            </Link>
            <span className="block truncate font-mono text-xs text-muted-foreground">/{p.slug}</span>
          </div>
        </div>
      ),
    },
    {
      id: "template",
      header: "Template",
      cell: (p) => (
        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {templateLabel(p)}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (p) => <StatusBadge status={p.status ?? "active"} />,
    },
    {
      id: "theme",
      header: "Theme",
      cell: (p) => swatches(p),
    },
  ];

  const filters: DataTableFilter<Row>[] = [
    {
      id: "template",
      label: "All templates",
      width: "w-[170px]",
      options: PARTNERSHIP_LANDING_TEMPLATES.map((tpl) => ({
        value: tpl,
        label: t(`landingTemplateOptions.${tpl}`),
      })),
    },
    {
      id: "status",
      label: "All status",
      width: "w-[140px]",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const renderCard = (p: Row) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2 p-5">
        <Link href={`/admin/partnerships/${p._id}`} className="flex min-w-0 items-center gap-3">
          {logo(p, "size-10")}
          <span className="min-w-0">
            <span className="block truncate font-medium text-foreground">{p.name}</span>
            <span className="block truncate font-mono text-xs text-muted-foreground">/{p.slug}</span>
          </span>
        </Link>
        {rowActions(p)}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {templateLabel(p)}
          </span>
          <StatusBadge status={p.status ?? "active"} />
        </div>
        {swatches(p)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <DataTable<Row>
        mode="server"
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        columns={columns}
        searchKeys={["name"]}
        searchPlaceholder="Search partnerships"
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        toolbarActions={
          <Button onClick={openNew}>
            <Plus className="mr-2 size-4" />
            {t("newPartnership")}
          </Button>
        }
        emptyTitle="No partnerships found"
        emptyDescription="Create a partnership or adjust your search."
        emptyIcon={Building2}
      />

      <EntityFormDialog open={isNew} onClose={close} guardAgainstDismiss>
        <PartnershipCreateForm onClose={close} />
      </EntityFormDialog>
    </div>
  );
}
