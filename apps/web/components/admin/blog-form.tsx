"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
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
import { Loader2, Info, FileText, Settings, Search, Clock, Calendar, User } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { LANGUAGES, BLOG_CATEGORIES } from "./constants";

interface BlogFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export function BlogForm({ isOpen, onClose, initialData }: BlogFormProps) {
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
  const [originalLanguage, setOriginalLanguage] = React.useState(initialData?.originalLanguage || "en");
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
      setOriginalLanguage(initialData.originalLanguage || "en");
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
      setOriginalLanguage("en");
      setStatus("draft");
      setIsFeatured(false);
      setIsService(false);
      setSeoTitle("");
      setSeoDescription("");
      setTags("");
      setPreviewUrl(null);
      setActiveTab("content");
    }
  }, [initialData, isOpen]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }

    if (!content || !content.content?.length) {
      toast.error("Content is required");
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
      toast.error("Something went wrong");
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>{initialData ? "Edit Blog" : "Add New Blog"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to your blog post."
              : "Create a new blog post. Fill in the content and settings."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="shrink-0 border-b border-zinc-200">
              <TabsList className="h-auto w-full bg-transparent p-0 grid grid-cols-3">
                <TabsTrigger
                  value="content"
                  className="relative py-4 rounded-none border-b-2 border-transparent text-sm font-medium transition-all data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-zinc-700 data-[state=inactive]:hover:bg-zinc-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="relative py-4 rounded-none border-b-2 border-transparent text-sm font-medium transition-all data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-zinc-700 data-[state=inactive]:hover:bg-zinc-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="seo"
                  className="relative py-4 rounded-none border-b-2 border-transparent text-sm font-medium transition-all data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:text-zinc-700 data-[state=inactive]:hover:bg-zinc-50"
                >
                  <Search className="h-4 w-4 mr-2" />
                  SEO
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 bg-white">
              <TabsContent value="content" className="p-6 pt-8 mt-0 space-y-6 data-[state=inactive]:hidden">
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
                    <p className="text-xs text-zinc-500">
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

              <TabsContent value="settings" className="p-6 pt-8 mt-0 space-y-6 data-[state=inactive]:hidden">
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
                  <p className="text-xs text-zinc-500 -mt-2">
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

                  <label className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAtFeaturedLimit || isService ? "border-zinc-100 bg-zinc-50 cursor-not-allowed" : "border-zinc-200 hover:bg-zinc-50 cursor-pointer"}`}>
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
                        <span className={`font-semibold text-sm ${isAtFeaturedLimit || isService ? "text-zinc-400" : "text-zinc-700"}`}>
                          Featured Post
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${featuredCount >= 6 ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>
                          {featuredCount}/6
                        </span>
                      </div>
                      <p className={`text-xs ${isAtFeaturedLimit || isService ? "text-zinc-400" : "text-zinc-500"}`}>
                        {isAtFeaturedLimit ? "Maximum of 6 featured posts reached" : "Show this post in the featured section on the homepage"}
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${isAtServiceLimit || isFeatured ? "border-zinc-100 bg-zinc-50 cursor-not-allowed" : "border-zinc-200 hover:bg-zinc-50 cursor-pointer"}`}>
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
                        <span className={`font-semibold text-sm ${isAtServiceLimit || isFeatured ? "text-zinc-400" : "text-zinc-700"}`}>
                          Service Post
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${serviceCount >= 3 ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>
                          {serviceCount}/3
                        </span>
                      </div>
                      <p className={`text-xs ${isAtServiceLimit || isFeatured ? "text-zinc-400" : "text-zinc-500"}`}>
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
                  <p className="text-xs text-zinc-500">
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
                        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Created</p>
                          <p className="font-medium text-zinc-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(initialData.createdAt)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Updated</p>
                          <p className="font-medium text-zinc-700 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {formatDate(initialData.updatedAt)}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Read Time</p>
                          <p className="font-medium text-zinc-700 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {initialData.readTimeMinutes} min read
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                          <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1">Slug</p>
                          <p className="font-medium text-zinc-700 truncate">
                            {initialData.slug}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="seo" className="p-6 pt-8 mt-0 space-y-6 data-[state=inactive]:hidden">
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
                    <p className="text-xs text-zinc-500">
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
                    <p className="text-xs text-zinc-500">
                      {seoDescription.length}/160 characters (recommended)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-base font-bold">Preview</Label>
                  <div className="p-4 rounded-lg border border-zinc-200 bg-zinc-50">
                    <p className="text-[#1a0dab] text-lg font-medium hover:underline cursor-pointer truncate">
                      {seoTitle || title || "Blog Post Title"}
                    </p>
                    <p className="text-[#006621] text-sm truncate">
                      easytransferericeira.com/blogs/{initialData?.slug || "your-blog-slug"}
                    </p>
                    <p className="text-zinc-600 text-sm line-clamp-2 mt-1">
                      {seoDescription || excerpt || "Your blog post description will appear here..."}
                    </p>
                  </div>
                  <p className="text-xs text-zinc-500">
                    This is how your post might appear in search results
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <div className="p-6 border-t bg-zinc-50 flex justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-900 text-white hover:bg-zinc-800 h-11 px-8 font-bold"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Blog"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
