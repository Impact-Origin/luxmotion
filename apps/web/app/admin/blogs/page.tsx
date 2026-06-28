"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Star,
  StarOff,
  Calendar,
  Globe,
  FileText,
  Languages,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { BlogForm } from "@/components/admin/blog-form";
import { BlogTranslationForm } from "@/components/admin/blog-translation-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable, type DataTableColumn, type DataTableFilter, type DataTableQuery } from "@/components/admin/data-table";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

const languageLabels: Record<string, string> = {
  en: "EN",
  pt: "PT",
  de: "DE",
  es: "ES",
  fr: "FR",
  nl: "NL",
};

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogsPage() {
  const t = useTranslations("adminBlogs");
  const [tableQuery, setTableQuery] = React.useState<DataTableQuery>({ page: 0, pageSize: 10, filters: {} });
  const res = useQuery(api.blogs.listPaged, tableQuery);
  const categories = useQuery(api.blogs.getCategories);
  const removeBlog = useMutation(api.blogs.remove);
  const toggleFeatured = useMutation(api.blogs.toggleFeatured);

  type Blog = NonNullable<typeof res>["rows"][number];

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBlog, setEditingBlog] = React.useState<any>(null);
  const [isTranslationFormOpen, setIsTranslationFormOpen] = React.useState(false);
  const [translatingBlog, setTranslatingBlog] = React.useState<any>(null);

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this blog? This action cannot be undone.")) {
      try {
        await removeBlog({ id });
        toast.success("Blog deleted successfully");
      } catch (error) {
        toast.error("Failed to delete blog");
      }
    }
  };

  const handleToggleFeatured = async (id: any) => {
    try {
      const isFeatured = await toggleFeatured({ id });
      toast.success(isFeatured ? "Blog marked as featured" : "Blog removed from featured");
    } catch (error) {
      toast.error("Failed to update blog");
    }
  };

  const handleCreateNew = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleManageTranslations = (blog: any) => {
    setTranslatingBlog(blog);
    setIsTranslationFormOpen(true);
  };

  const rowActions = (blog: Blog) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleEdit(blog)}>
          <Edit2 className="mr-2 size-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/blogs/${blog.slug}`} target="_blank">
            <Eye className="mr-2 size-4" />
            {t("preview")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleFeatured(blog._id)}>
          {blog.isFeatured ? (
            <>
              <StarOff className="mr-2 size-4" />
              {t("removeFeatured")}
            </>
          ) : (
            <>
              <Star className="mr-2 size-4" />
              {t("makeFeatured")}
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleManageTranslations(blog)}>
          <Languages className="mr-2 size-4" />
          {t("translations")}
          {blog.availableLanguages?.length > 1 && (
            <span className="ml-auto text-xs text-muted-foreground">
              {blog.availableLanguages.length - 1}
            </span>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(blog._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const columns: DataTableColumn<Blog>[] = [
    {
      id: "title",
      header: "Title",
      sortAccessor: (b) => b.title.toLowerCase(),
      cell: (b) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {b.heroImageUrl ? (
              <Image src={b.heroImageUrl} alt={b.title} fill className="object-cover" />
            ) : (
              <FileText className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-medium text-foreground">{b.title}</span>
              {b.isFeatured && <Star className="size-3.5 shrink-0 fill-current text-primary" />}
            </div>
            <p className="line-clamp-1 text-xs text-muted-foreground">{b.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "Category",
      cell: (b) => (
        <span className="inline-flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-medium">
            {b.category}
          </Badge>
          {b.isService && (
            <Badge variant="outline" className="text-[10px] font-medium">
              {t("service")}
            </Badge>
          )}
        </span>
      ),
    },
    {
      id: "languages",
      header: "Languages",
      cell: (b) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Globe className="size-3.5" />
          <span className="font-medium uppercase">
            {languageLabels[b.originalLanguage] || b.originalLanguage}
          </span>
          {b.availableLanguages?.length > 1 && (
            <span className="text-xs">+{b.availableLanguages.length - 1}</span>
          )}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (b) => <StatusBadge status={b.status} label={t(b.status)} />,
    },
    {
      id: "date",
      header: "Date",
      align: "right",
      sortAccessor: (b) => b.createdAt,
      cell: (b) => (
        <span className="inline-flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
          <Calendar className="size-3.5" />
          {formatDate(b.createdAt)}
        </span>
      ),
    },
  ];

  const filters: DataTableFilter<Blog>[] = [
    {
      id: "status",
      label: t("allStatus"),
      width: "w-[140px]",
      options: [
        { value: "draft", label: t("draft") },
        { value: "published", label: t("published") },
        { value: "archived", label: t("archived") },
      ],
      predicate: (b, val) => b.status === val,
    },
    {
      id: "category",
      label: t("allCategories"),
      width: "w-[160px]",
      options: (categories ?? []).map((cat) => ({ value: cat.toLowerCase(), label: cat })),
      predicate: (b, val) => b.category.toLowerCase() === val,
    },
  ];

  const renderCard = (blog: Blog) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-[16/7] border-b border-border bg-muted/40">
        {blog.heroImageUrl ? (
          <Image src={blog.heroImageUrl} alt={blog.title} fill className="object-cover" />
        ) : (
          <div className="flex size-full flex-col items-center justify-center text-muted-foreground">
            <FileText className="mb-1 size-6" />
            <span className="text-xs">{t("noImage")}</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <StatusBadge status={blog.status} label={t(blog.status)} />
          {blog.isFeatured && (
            <Badge className="h-5 bg-primary px-2 text-[10px] font-medium text-primary-foreground">
              <Star className="mr-1 size-3 fill-current" />
              {t("featured")}
            </Badge>
          )}
        </div>
        <div className="absolute right-2 top-2">{rowActions(blog)}</div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-medium">
            {blog.category}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Globe className="size-3" />
            <span className="text-[10px] font-medium uppercase">
              {languageLabels[blog.originalLanguage] || blog.originalLanguage}
            </span>
            {blog.availableLanguages?.length > 1 && (
              <span className="text-[10px] font-medium">+{blog.availableLanguages.length - 1}</span>
            )}
          </div>
        </div>
        <h3 className="line-clamp-2 text-sm font-medium leading-tight text-foreground">
          {blog.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{blog.excerpt}</p>
        <div className="mt-auto flex items-center gap-1 pt-3 text-[11px] text-muted-foreground">
          <Calendar className="size-3" />
          {formatDate(blog.createdAt)}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DataTable<Blog>
        mode="server"
        data={res?.rows}
        total={res?.total ?? 0}
        pageSize={10}
        onQueryChange={setTableQuery}
        columns={columns}
        searchKeys={["title", "excerpt", "category"]}
        searchPlaceholder={t("searchPlaceholder")}
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        initialSort={{ columnId: "date", dir: "desc" }}
        toolbarActions={
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 size-4" />
            {t("addBlog")}
          </Button>
        }
        emptyTitle={t("noBlogsFound")}
        emptyIcon={FileText}
      />

      <BlogForm
        key={editingBlog?._id || "new"}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBlog(null);
        }}
        initialData={editingBlog}
      />

      {translatingBlog && (
        <BlogTranslationForm
          key={translatingBlog._id}
          isOpen={isTranslationFormOpen}
          onClose={() => {
            setIsTranslationFormOpen(false);
            setTranslatingBlog(null);
          }}
          blogId={translatingBlog._id}
          originalLanguage={translatingBlog.originalLanguage}
          originalTitle={translatingBlog.title}
        />
      )}
    </>
  );
}
