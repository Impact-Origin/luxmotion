"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { defaultTheme } from "@/components/dynamic-theme-provider";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ImageUpload } from "@/components/admin/image-upload";

export default function NewPartnershipPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const createPartnership = useMutation(api.partnerships.create);
  const router = useRouter();
  const t = useTranslations("admin");

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [logoId, setLogoId] = React.useState<string | undefined>();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const id = await createPartnership({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        theme: defaultTheme,
        content: {},
        logoId: logoId as any,
        status: "active",
      });
      toast.success("Partnership created successfully");
      router.push(`/admin/partnerships/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create partnership");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans">
      <Link href="/admin/partnerships" className="inline-flex items-center text-sm font-bold text-zinc-400 hover:text-zinc-900 transition-colors group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Partnerships
      </Link>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{t("newPartnership")}</h2>
        <p className="text-sm text-zinc-500 font-medium">Create a new referral partnership and customize their landing page.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-zinc-200 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Company Logo</Label>
            <ImageUpload 
              onChange={setLogoId}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t("partnershipName")}</Label>
            <Input
              id="name"
              placeholder="e.g. Macy's Hotel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-12 font-bold text-zinc-900 border-zinc-200 focus:border-zinc-400 focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-zinc-400">{t("urlSlug")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400 font-mono text-sm font-bold">easytransferportugal.com/</span>
              <Input
                id="slug"
                placeholder="macys"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-12 font-mono font-bold text-zinc-900 border-zinc-200 focus:border-zinc-400 focus:ring-0"
              />
            </div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">This will be the unique URL for this partner.</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="h-12 bg-zinc-900 text-white hover:bg-zinc-800 font-bold px-8 shadow-xl">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Partnership & Start Customizing
          </Button>
        </div>
      </form>
    </div>
  );
}

