"use client";

import * as React from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { cn } from "@workspace/ui/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (storageId: string | undefined) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl);

  React.useEffect(() => {
    if (!value) {
      setLocalPreview(null);
    }
  }, [value]);

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      const localUrl = URL.createObjectURL(file);
      setLocalPreview(localUrl);

      const postUrl = await generateUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();
      onChange(storageId);
    } catch (error) {
      console.error("Upload failed:", error);
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setLocalPreview(null);
    onChange(undefined);
  };

  const displayUrl = localPreview || value;

  return (
    <div className="space-y-4 w-full">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e7ddca] transition-all hover:bg-[#A08248]/[0.06]/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {displayUrl ? (
          <div className="relative aspect-video w-full max-h-64 overflow-hidden rounded-lg">
            <div className="absolute right-2 top-2 z-10">
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full bg-rose-500 p-1 text-white hover:bg-rose-600 transition-colors"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <img
              src={displayUrl}
              alt="Upload preview"
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-6">
            <div className="mb-4 rounded-full bg-[#f1e8d8] p-3">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#8a8074]" />
              ) : (
                <Upload className="h-6 w-6 text-[#8a8074]" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#211c16]">
                {isUploading ? "Uploading..." : "Click to upload image"}
              </p>
              <p className="mt-1 text-xs text-[#8a8074]">
                PNG, JPG or WebP (max. 5MB)
              </p>
            </div>
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={onUpload}
              disabled={disabled || isUploading}
              accept="image/*"
            />
          </div>
        )}
      </div>
    </div>
  );
}
