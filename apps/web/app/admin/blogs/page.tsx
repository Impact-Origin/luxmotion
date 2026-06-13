"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Star,
  StarOff,
  Clock,
  Calendar,
  Globe,
  FileText,
  Languages,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { BlogForm } from "@/components/admin/blog-form";
import { BlogTranslationForm } from "@/components/admin/blog-translation-form";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";
import Link from "next/link";

const statusConfig = {
  draft: { label: "Draft", className: "bg-amber-50 text-amber-700 border-amber-100" },
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  archived: { label: "Archived", className: "bg-[#f1e8d8] text-[#5c554c] border-[#e7ddca]" },
};

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

interface BlogCardProps {
  blog: any;
  onEdit: (blog: any) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onManageTranslations: (blog: any) => void;
  t: (key: string, values?: Record<string, any>) => string;
}

function BlogCard({ blog, onEdit, onDelete, onToggleFeatured, onManageTranslations, t }: BlogCardProps) {
  return (
    <div className="bg-white rounded-[16px] border border-[#e8e8e8] overflow-hidden hover:shadow-md transition-all duration-200 group flex flex-col">
      <div className="relative h-[160px] bg-[#f1e8d8] overflow-hidden">
        {blog.heroImageUrl ? (
          <Image
            src={blog.heroImageUrl}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#a99e8c]">
            <FileText className="h-8 w-8 mb-2" />
            <span className="text-xs">{t("noImage")}</span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className={cn(
              "h-6 px-2.5 text-[10px] font-bold shadow-sm uppercase tracking-tight border",
              statusConfig[blog.status as keyof typeof statusConfig]?.className
            )}
          >
            {statusConfig[blog.status as keyof typeof statusConfig]?.label}
          </Badge>
          {blog.isFeatured && (
            <Badge className="h-6 px-2.5 text-[10px] font-bold shadow-sm uppercase tracking-tight bg-yellow-50 text-yellow-700 border-yellow-200">
              <Star className="h-3 w-3 mr-1 fill-current" />
              {t("featured")}
            </Badge>
          )}
          {blog.isService && (
            <Badge className="h-6 px-2.5 text-[10px] font-bold shadow-sm uppercase tracking-tight bg-blue-50 text-blue-700 border-blue-200">
              {t("service")}
            </Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white shadow-sm"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(blog)}>
                <Edit2 className="mr-2 h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/blogs/${blog.slug}`} target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  {t("preview")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFeatured(blog._id)}>
                {blog.isFeatured ? (
                  <>
                    <StarOff className="mr-2 h-4 w-4" />
                    {t("removeFeatured")}
                  </>
                ) : (
                  <>
                    <Star className="mr-2 h-4 w-4" />
                    {t("makeFeatured")}
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageTranslations(blog)}>
                <Languages className="mr-2 h-4 w-4" />
                {t("translations")}
                {blog.availableLanguages?.length > 1 && (
                  <span className="ml-auto text-xs text-[#27c7ff]">
                    {blog.availableLanguages.length - 1}
                  </span>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(blog._id)}
                className="text-rose-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-medium text-[#27c7ff] border-[#27c7ff]/30 bg-[#27c7ff]/5">
            {blog.category}
          </Badge>
          <div className="flex items-center gap-1 text-[#a99e8c]">
            <Globe className="h-3 w-3" />
            <span className="text-[10px] font-medium uppercase">
              {languageLabels[blog.originalLanguage] || blog.originalLanguage}
            </span>
            {blog.availableLanguages?.length > 1 && (
              <span className="text-[10px] text-[#27c7ff] font-medium">
                +{blog.availableLanguages.length - 1}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-[15px] font-bold text-[#211c16] leading-tight line-clamp-2">
          {blog.title}
        </h3>

        <p className="text-[13px] text-[#8a8074] leading-snug line-clamp-2">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between text-[#a99e8c] text-[11px]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {blog.readTimeMinutes} min
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(blog.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-[16px] border border-[#e8e8e8] overflow-hidden bg-white">
          <Skeleton className="h-[160px] w-full" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-10" />
            </div>
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4 pt-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onCreateClick, t }: { onCreateClick: () => void; t: (key: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-[#e8e8e8]">
      <FileText className="h-10 w-10 text-[#a2a2a2] mb-4" />
      <p className="text-[#808080] font-medium mb-2">{t("noBlogsFound")}</p>
      <Button
        variant="link"
        onClick={onCreateClick}
        className="text-[#27c7ff] hover:text-[#27c7ff]/80"
      >
        {t("createFirstBlog")}
      </Button>
    </div>
  );
}

export default function BlogsPage() {
  const t = useTranslations("adminBlogs");
  const blogs = useQuery(api.blogs.list);
  const categories = useQuery(api.blogs.getCategories);
  const removeBlog = useMutation(api.blogs.remove);
  const toggleFeatured = useMutation(api.blogs.toggleFeatured);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBlog, setEditingBlog] = React.useState<any>(null);
  const [isTranslationFormOpen, setIsTranslationFormOpen] = React.useState(false);
  const [translatingBlog, setTranslatingBlog] = React.useState<any>(null);

  const filteredBlogs = React.useMemo(() => {
    if (!blogs) return [];

    return blogs
      .filter((blog) => {
        const matchesSearch =
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || blog.status === statusFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          blog.category.toLowerCase() === categoryFilter.toLowerCase();

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [blogs, searchQuery, statusFilter, categoryFilter]);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#211c16]">{t("title")}</h2>
          <p className="text-[#8a8074] text-sm">
            {t("subtitle")}
          </p>
        </div>
        <Button
          onClick={handleCreateNew}
          className="bg-[#221c15] text-white hover:bg-[#3a3026]"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("addBlog")}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 bg-white p-4 rounded-xl border border-[#e7ddca] shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a99e8c]" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-9 border-[#e7ddca]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[140px]">
              <SelectValue placeholder={t("allStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatus")}</SelectItem>
              <SelectItem value="draft">{t("draft")}</SelectItem>
              <SelectItem value="published">{t("published")}</SelectItem>
              <SelectItem value="archived">{t("archived")}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder={t("allCategories")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allCategories")}</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {blogs === undefined ? (
        <BlogListSkeleton />
      ) : filteredBlogs.length === 0 ? (
        <EmptyState onCreateClick={handleCreateNew} t={t} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFeatured={handleToggleFeatured}
              onManageTranslations={handleManageTranslations}
              t={t}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}
