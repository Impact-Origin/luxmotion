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
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ImageUpload } from "@/components/admin/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  PARTNERSHIP_LANDING_TEMPLATES,
  DEFAULT_PARTNERSHIP_LANDING_TEMPLATE,
  type PartnershipLandingTemplate,
} from "@/lib/partnership-landing-templates";

export default function NewPartnershipPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const createPartnership = useMutation(api.partnerships.create);
  const router = useRouter();
  const t = useTranslations("admin");

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [logoId, setLogoId] = React.useState<string | undefined>();
  const [landingTemplate, setLandingTemplate] = React.useState<PartnershipLandingTemplate>(
    DEFAULT_PARTNERSHIP_LANDING_TEMPLATE,
  );

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
        landingTemplate,
      });
      toast.success("Partnership created");
      router.push(`/admin/partnerships/${id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create partnership");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        href="/admin/partnerships"
        className="group inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="mr-2 size-4 transition-transform group-hover:-translate-x-1" />
        Back to partnerships
      </Link>

      <div className="space-y-1">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">{t("newPartnership")}</h2>
        <p className="text-sm text-muted-foreground">
          Create a new referral partnership and customize their landing page.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 rounded-xl border border-border bg-card p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Company logo
            </Label>
            <ImageUpload onChange={setLogoId} disabled={isSubmitting} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("partnershipName")}
            </Label>
            <Input
              id="name"
              placeholder="e.g. Macy's Hotel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("urlSlug")}
            </Label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">easytransferportugal.com/</span>
              <Input
                id="slug"
                placeholder="macys"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                disabled={isSubmitting}
                className="h-12 font-mono"
              />
            </div>
            <p className="text-[11px] uppercase tracking-tight text-muted-foreground">
              This will be the unique URL for this partner.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {t("landingTemplate")}
            </Label>
            <Select
              value={landingTemplate}
              onValueChange={(v) => setLandingTemplate(v as PartnershipLandingTemplate)}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder={t("landingTemplate")} />
              </SelectTrigger>
              <SelectContent>
                {PARTNERSHIP_LANDING_TEMPLATES.map((template) => (
                  <SelectItem key={template} value={template}>
                    {t(`landingTemplateOptions.${template}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              {t(`landingTemplateDescriptions.${landingTemplate}`)}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting} className="h-12 px-8">
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create partnership & start customizing
          </Button>
        </div>
      </form>
    </div>
  );
}
