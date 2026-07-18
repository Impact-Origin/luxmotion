"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ImageUpload } from "./image-upload";
import { BlogEditor } from "./blog-editor";
import { toast } from "sonner";
import { Loader2, Info, FileText, Settings, Search, Clock, Calendar, User, ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent } from "@workspace/ui/components/tabs";
import { LANGUAGES, BLOG_CATEGORIES } from "./constants";

const STEP_ORDER = ["content", "settings", "seo"];

interface BlogFormProps {
  onClose: () => void;
  initialData?: any;
}

export function BlogForm({ onClose, initialData }: BlogFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("content");

  const [title, setTitle] = React.useState(initialData?.title || "");
  const [excerpt, setExcerpt] = React.useState(initialData?.excerpt || "");
  const [content, setContent] = React.useState<any>(initialData?.content || null);
  const [heroImageId, setHeroImageId] = React.useState<string | undefined>(initialData?.heroImageId);
  const [category, setCategory] = React.useState(initialData?.category || "Lisbon");
  const [author, setAuthor] = React.useState(initialData?.author || "EasyTransfer Team");
  const [authorRole, setAuthorRole] = React.useState(initialData?.authorRole || "");
  const [authorBio, setAuthorBio] = React.useState(initialData?.authorBio || "");
  const [authorAvatarId, setAuthorAvatarId] = React.useState<string | undefined>(initialData?.authorAvatarId);
  const [authorAvatarPreview, setAuthorAvatarPreview] = React.useState<string | null>(initialData?.authorAvatarUrl || null);
  const [originalLanguage, setOriginalLanguage] = React.useState(initialData?.originalLanguage || "pt");
  const [status, setStatus] = React.useState<"draft" | "published" | "archived">(initialData?.status || "draft");
  const [isFeatured, setIsFeatured] = React.useState(initialData?.isFeatured || false);
  const [isService, setIsService] = React.useState(initialData?.isService || false);
  const [seoTitle, setSeoTitle] = React.useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = React.useState(initialData?.seoDescription || "");
  const [tags, setTags] = React.useState<string>(initialData?.tags?.join(", ") || "");

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(initialData?.heroImageUrl || null);

  const createBlog = useMutation(api.blogs.create);
  const updateBlog = useMutation(api.blogs.update);
  const featuredCount = useQuery(api.blogs.countFeatured) ?? 0;
  const serviceCount = useQuery(api.blogs.countServices) ?? 0;
  const isAtFeaturedLimit = featuredCount >= 6 && !initialData?.isFeatured;
  const isAtServiceLimit = serviceCount >= 3 && !initialData?.isService;

  React.useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setExcerpt(initialData.excerpt || "");
      setContent(initialData.content || null);
      setHeroImageId(initialData.heroImageId);
      setCategory(initialData.category || "Lisbon");
      setAuthor(initialData.author || "EasyTransfer Team");
      setAuthorRole(initialData.authorRole || "");
      setAuthorBio(initialData.authorBio || "");
      setAuthorAvatarId(initialData.authorAvatarId);
      setAuthorAvatarPreview(initialData.authorAvatarUrl || null);
      setOriginalLanguage(initialData.originalLanguage || "pt");
      setStatus(initialData.status || "draft");
      setIsFeatured(initialData.isFeatured || false);
      setIsService(initialData.isService || false);
      setSeoTitle(initialData.seoTitle || "");
      setSeoDescription(initialData.seoDescription || "");
      setTags(initialData.tags?.join(", ") || "");
      setPreviewUrl(initialData.heroImageUrl || null);
      setActiveTab("content");
    } else {
      setTitle("");
      setExcerpt("");
      setContent(null);
      setHeroImageId(undefined);
      setCategory("Lisbon");
      setAuthor("EasyTransfer Team");
      setAuthorRole("");
      setAuthorBio("");
      setAuthorAvatarId(undefined);
      setAuthorAvatarPreview(null);
      setOriginalLanguage("pt");
      setStatus("draft");
      setIsFeatured(false);
      setIsService(false);
      setSeoTitle("");
      setSeoDescription("");
      setTags("");
      setPreviewUrl(null);
      setActiveTab("content");
    }
  }, [initialData]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wizard: pressing Enter / submitting before the last step just advances.
    if (activeTab !== "seo") {
      const idx = STEP_ORDER.indexOf(activeTab);
      setActiveTab(STEP_ORDER[Math.min(STEP_ORDER.length - 1, idx + 1)]!);
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      setActiveTab("content");
      return;
    }

    if (!excerpt.trim()) {
      toast.error("Excerpt is required");
      setActiveTab("content");
      return;
    }

    if (!content || !content.content?.length) {
      toast.error("Content is required");
      setActiveTab("content");
      return;
    }

    try {
      setIsSubmitting(true);

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const data = {
        title,
        excerpt,
        content,
        heroImageId: heroImageId as any,
        category,
        author,
        authorRole: authorRole || undefined,
        authorBio: authorBio || undefined,
        authorAvatarId: authorAvatarId as any,
        originalLanguage,
        status,
        isFeatured,
        isService,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      };

      if (initialData) {
        await updateBlog({ id: initialData._id, ...data });
        toast.success("Blog updated successfully");
      } else {
        await createBlog(data);
        toast.success("Blog created successfully");
      }

      onClose();
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg && msg !== "[object Object]" ? msg : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const headerTitle = initialData ? "Edit Blog" : "Add New Blog";
  const headerDescription = initialData
    ? "Make changes to your blog post."
    : "Create a new blog post. Fill in the content and settings.";

  const STEPS = [
    { value: "content", label: "Content", icon: FileText },
    { value: "settings", label: "Settings", icon: Settings },
    { value: "seo", label: "SEO", icon: Search },
  ];
  const currentStepIndex = Math.max(0, STEP_ORDER.indexOf(activeTab));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-foreground">{headerTitle}</h2>
          <p className="text-sm text-muted-foreground">{headerDescription}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="shrink-0 rounded-full h-9 w-9 flex items-center justify-center bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="sticky top-0 z-10 -mx-4 border-b border-border bg-background px-4 py-3 lg:-mx-8 lg:px-8">
        <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[1px] text-muted-foreground">
          <span className="truncate">{STEPS[currentStepIndex]?.label}</span>
          <span className="shrink-0 pl-3 tabular-nums">
            {currentStepIndex + 1} / {STEPS.length}
          </span>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded bg-muted">
          <div
            className="absolute left-0 top-0 h-1 rounded bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((step, i) => {
            const isActive = step.value === activeTab;
            const isDone = i < currentStepIndex;
            return (
              <button
                key={step.value}
                type="button"
                onClick={() => setActiveTab(step.value)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isDone
                      ? "border-primary/40 bg-primary/10 text-foreground hover:bg-primary/15"
                      : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold",
                    isActive
                      ? "bg-primary-foreground/20"
                      : isDone
                        ? "bg-primary/20"
                        : "bg-muted",
                  )}
                >
                  {isDone ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className="whitespace-nowrap">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="rounded-lg border border-border bg-card">
              <TabsContent value="content" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <Info className="h-4 w-4" /> Hero Image
                  </Label>
                  <ImageUpload
                    value={previewUrl}
                    onChange={(id) => {
                      setHeroImageId(id);
                      if (!id) setPreviewUrl(null);
                    }}
                    disabled={isSubmitting}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter blog title..."
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={category} onValueChange={setCategory} disabled={isSubmitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOG_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Original Language *</Label>
                      <Select value={originalLanguage} onValueChange={setOriginalLanguage} disabled={isSubmitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief summary of the blog post..."
                      required
                      disabled={isSubmitting}
                      className="min-h-[80px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {excerpt.length}/300 characters
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-bold">Content *</Label>
                  <BlogEditor
                    content={content}
                    onChange={setContent}
                    disabled={isSubmitting}
                    placeholder="Start writing your blog post..."
                    minHeight="350px"
                  />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Publishing
                  </Label>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={status}
                        onValueChange={(val) => setStatus(val as typeof status)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Author Name</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Author name"
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <User className="h-4 w-4" /> Author Profile
                  </Label>
                  <p className="text-xs text-muted-foreground -mt-2">
                    Shown on the blog detail page sidebar. Leave role/bio empty to use the default LuxMotion text.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="space-y-2">
                      <Label>Profile Picture</Label>
                      <div className="w-32">
                        <ImageUpload
                          value={authorAvatarPreview}
                          onChange={(id) => {
                            setAuthorAvatarId(id);
                            if (!id) setAuthorAvatarPreview(null);
                          }}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="authorRole">Role / Title</Label>
                        <Input
                          id="authorRole"
                          value={authorRole}
                          onChange={(e) => setAuthorRole(e.target.value)}
                          placeholder="e.g. Equipa LuxMotion"
                          disabled={isSubmitting}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="authorBio">Description</Label>
                        <Textarea
                          id="authorBio"
                          value={authorBio}
                          onChange={(e) => setAuthorBio(e.target.value)}
                          placeholder="Short bio shown under the author's name..."
                          disabled={isSubmitting}
                          className="min-h-[80px] resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <label className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAtFeaturedLimit || isService ? "border-border bg-muted cursor-not-allowed" : "border-border hover:bg-accent cursor-pointer"}`}>
                    <Checkbox
                      checked={isFeatured}
                      onCheckedChange={(checked) => {
                        setIsFeatured(checked as boolean);
                        if (checked) setIsService(false);
                      }}
                      disabled={isSubmitting || isAtFeaturedLimit || isService}
                      className="size-5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-sm ${isAtFeaturedLimit || isService ? "text-muted-foreground" : "text-foreground"}`}>
                          Featured Post
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${featuredCount >= 6 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                          {featuredCount}/6
                        </span>
                      </div>
                      <p className={`text-xs ${isAtFeaturedLimit || isService ? "text-muted-foreground" : "text-muted-foreground"}`}>
                        {isAtFeaturedLimit ? "Maximum of 6 featured posts reached" : "Show this post in the featured section on the homepage"}
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAtServiceLimit || isFeatured ? "border-border bg-muted cursor-not-allowed" : "border-border hover:bg-accent cursor-pointer"}`}>
                    <Checkbox
                      checked={isService}
                      onCheckedChange={(checked) => {
                        setIsService(checked as boolean);
                        if (checked) setIsFeatured(false);
                      }}
                      disabled={isSubmitting || isAtServiceLimit || isFeatured}
                      className="size-5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-sm ${isAtServiceLimit || isFeatured ? "text-muted-foreground" : "text-foreground"}`}>
                          Service Post
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${serviceCount >= 3 ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                          {serviceCount}/3
                        </span>
                      </div>
                      <p className={`text-xs ${isAtServiceLimit || isFeatured ? "text-muted-foreground" : "text-muted-foreground"}`}>
                        {isAtServiceLimit ? "Maximum of 3 service posts reached" : "Show this post in the services section on the tours page"}
                      </p>
                    </div>
                  </label>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-bold">Tags</Label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="travel, portugal, lisbon (comma separated)"
                    disabled={isSubmitting}
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate tags with commas
                  </p>
                </div>

                {initialData && (
                  <>
                    <Separator />

                    <div className="space-y-4">
                      <Label className="text-base font-bold flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Metadata
                      </Label>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 rounded-lg bg-muted border border-border">
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Created</p>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(initialData.createdAt)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted border border-border">
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Updated</p>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(initialData.updatedAt)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted border border-border">
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Read Time</p>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {initialData.readTimeMinutes} min read
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted border border-border">
                          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Slug</p>
                          <p className="font-medium text-foreground truncate">
                            {initialData.slug}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="seo" className="p-6 mt-0 space-y-4 data-[state=inactive]:hidden">
                <div className="space-y-4">
                  <Label className="text-base font-bold flex items-center gap-2">
                    <Search className="h-4 w-4" /> Search Engine Optimization
                  </Label>

                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      placeholder={title || "Enter SEO title..."}
                      disabled={isSubmitting}
                      className="h-11"
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoTitle.length}/60 characters (recommended)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={seoDescription}
                      onChange={(e) => setSeoDescription(e.target.value)}
                      placeholder={excerpt || "Enter meta description..."}
                      disabled={isSubmitting}
                      className="min-h-[100px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {seoDescription.length}/160 characters (recommended)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-bold">Preview</Label>
                  <div className="p-4 rounded-lg border border-border bg-muted">
                    <p className="text-foreground text-lg font-medium hover:underline cursor-pointer truncate">
                      {seoTitle || title || "Blog Post Title"}
                    </p>
                    <p className="text-primary text-sm truncate">
                      easytransferericeira.com/blogs/{initialData?.slug || "your-blog-slug"}
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {seoDescription || excerpt || "Your blog post description will appear here..."}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is how your post might appear in search results
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

      <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-3 lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11 px-5"
          >
            Cancel
          </Button>
          {currentStepIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveTab(STEP_ORDER[currentStepIndex - 1]!)}
              disabled={isSubmitting}
              className="h-11 px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          )}
        </div>
        {currentStepIndex < STEP_ORDER.length - 1 ? (
          <Button
            type="button"
            onClick={() => setActiveTab(STEP_ORDER[currentStepIndex + 1]!)}
            className="h-11 px-8 font-bold"
          >
            Seguinte
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} className="h-11 px-8 font-bold">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Save Changes" : "Create Blog"}
          </Button>
        )}
      </div>
    </form>
  );
}
