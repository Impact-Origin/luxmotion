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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { BlogEditor } from "./blog-editor";
import { toast } from "sonner";
import { Loader2, Globe, Plus, Trash2, Search } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

interface BlogTranslationFormProps {
  isOpen: boolean;
  onClose: () => void;
  blogId: string;
  originalLanguage: string;
  originalTitle: string;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "pt", label: "Portuguese" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "nl", label: "Dutch" },
];

export function BlogTranslationForm({
  isOpen,
  onClose,
  blogId,
  originalLanguage,
  originalTitle,
}: BlogTranslationFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedLocale, setSelectedLocale] = React.useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newLocale, setNewLocale] = React.useState("");

  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [content, setContent] = React.useState<any>(null);
  const [seoTitle, setSeoTitle] = React.useState("");
  const [seoDescription, setSeoDescription] = React.useState("");

  const blog = useQuery(api.blogs.getById, { id: blogId as any });
  const upsertTranslation = useMutation(api.blogs.upsertTranslation);
  const removeTranslation = useMutation(api.blogs.removeTranslation);

  const existingTranslations = blog?.translations || [];
  const availableLanguages = LANGUAGES.filter(
    (l) => l.value !== originalLanguage && !existingTranslations.some((t) => t.locale === l.value)
  );

  React.useEffect(() => {
    if (selectedLocale && existingTranslations.length > 0) {
      const translation = existingTranslations.find((t) => t.locale === selectedLocale);
      if (translation) {
        setTitle(translation.title || "");
        setExcerpt(translation.excerpt || "");
        setContent(translation.content || null);
        setSeoTitle(translation.seoTitle || "");
        setSeoDescription(translation.seoDescription || "");
      }
    }
  }, [selectedLocale, existingTranslations]);

  const handleSelectTranslation = (locale: string) => {
    setSelectedLocale(locale);
    setIsAddingNew(false);

    const translation = existingTranslations.find((t) => t.locale === locale);
    if (translation) {
      setTitle(translation.title || "");
      setExcerpt(translation.excerpt || "");
      setContent(translation.content || null);
      setSeoTitle(translation.seoTitle || "");
      setSeoDescription(translation.seoDescription || "");
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setSelectedLocale(null);
    setTitle("");
    setExcerpt("");
    setContent(null);
    setSeoTitle("");
    setSeoDescription("");
    setNewLocale(availableLanguages[0]?.value || "");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const locale = isAddingNew ? newLocale : selectedLocale;

    if (!locale) {
      toast.error("Please select a language");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!excerpt.trim()) {
      toast.error("Excerpt is required");
      return;
    }

    try {
      setIsSubmitting(true);

      await upsertTranslation({
        blogId: blogId as any,
        locale,
        title,
        excerpt,
        content,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      });

      toast.success(isAddingNew ? "Translation added successfully" : "Translation updated successfully");

      if (isAddingNew) {
        setSelectedLocale(locale);
        setIsAddingNew(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLocale) return;

    if (!confirm(`Are you sure you want to delete the ${LANGUAGES.find((l) => l.value === selectedLocale)?.label} translation?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await removeTranslation({ blogId: blogId as any, locale: selectedLocale });
      toast.success("Translation deleted successfully");
      setSelectedLocale(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete translation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLanguageLabel = (value: string) => {
    return LANGUAGES.find((l) => l.value === value)?.label || value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Manage Translations
          </DialogTitle>
          <DialogDescription>
            Add or edit translations for "{originalTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-[200px] border-r bg-[#faf6ee] p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
            <div className="text-xs font-bold text-[#8a8074] uppercase tracking-wider mb-2">
              Original
            </div>
            <div className="p-2 rounded-md bg-[#e7ddca] text-[#4a443c] text-sm font-medium">
              {getLanguageLabel(originalLanguage)}
            </div>

            <div className="text-xs font-bold text-[#8a8074] uppercase tracking-wider mt-4 mb-2">
              Translations
            </div>

            {existingTranslations.length === 0 && !isAddingNew ? (
              <p className="text-xs text-[#a99e8c] py-2">No translations yet</p>
            ) : (
              <div className="flex flex-col gap-1">
                {existingTranslations.map((t) => (
                  <button
                    key={t.locale}
                    onClick={() => handleSelectTranslation(t.locale)}
                    className={cn(
                      "p-2 rounded-md text-left text-sm font-medium transition-colors",
                      selectedLocale === t.locale && !isAddingNew
                        ? "bg-[#27c7ff] text-white"
                        : "hover:bg-[#A08248]/[0.12] text-[#4a443c]"
                    )}
                  >
                    {getLanguageLabel(t.locale)}
                  </button>
                ))}
              </div>
            )}

            {availableLanguages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddNew}
                className={cn(
                  "mt-4 w-full justify-start",
                  isAddingNew && "bg-[#27c7ff] text-white border-[#27c7ff] hover:bg-[#27c7ff]/90"
                )}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Translation
              </Button>
            )}
          </div>

          <form onSubmit={onSubmit} className="flex-1 overflow-hidden flex flex-col">
            {!selectedLocale && !isAddingNew ? (
              <div className="flex-1 flex flex-col items-center justify-center text-[#a99e8c] p-8">
                <Globe className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium mb-2">Select or add a translation</p>
                <p className="text-sm text-center">
                  Choose an existing translation from the left panel or add a new one.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {isAddingNew && (
                    <div className="space-y-2">
                      <Label htmlFor="language">Language *</Label>
                      <Select value={newLocale} onValueChange={setNewLocale} disabled={isSubmitting}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableLanguages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Translated title..."
                      required
                      disabled={isSubmitting}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Translated excerpt..."
                      required
                      disabled={isSubmitting}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-bold">Content</Label>
                    <BlogEditor
                      content={content}
                      onChange={setContent}
                      disabled={isSubmitting}
                      placeholder="Translated content..."
                      minHeight="250px"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base font-bold flex items-center gap-2">
                      <Search className="h-4 w-4" /> SEO (Optional)
                    </Label>

                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder="Translated SEO title..."
                        disabled={isSubmitting}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        placeholder="Translated meta description..."
                        disabled={isSubmitting}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t bg-[#faf6ee] flex justify-between gap-3 shrink-0">
                  <div>
                    {selectedLocale && !isAddingNew && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDelete}
                        disabled={isSubmitting}
                        className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-3">
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
                      className="bg-[#221c15] text-white hover:bg-[#3a3026] h-11 px-8 font-bold"
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isAddingNew ? "Add Translation" : "Save Translation"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
