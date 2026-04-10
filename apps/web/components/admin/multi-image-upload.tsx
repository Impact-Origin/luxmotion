"use client"

import * as React from "react"
import { Upload, X, Loader2, Plus } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"

interface ImageItem {
  id: string
  url: string
  isLocal?: boolean
}

interface MultiImageUploadProps {
  value: ImageItem[]
  onChange: (items: ImageItem[]) => void
  disabled?: boolean
  maxImages?: number
  label?: string
}

export function MultiImageUpload({
  value,
  onChange,
  disabled,
  maxImages = 5,
  label,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl)

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - value.length
    if (remainingSlots <= 0) return

    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    try {
      setIsUploading(true)

      const uploadedItems: ImageItem[] = []

      for (const file of filesToUpload) {
        const localUrl = URL.createObjectURL(file)

        const postUrl = await generateUploadUrl()
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        })

        const { storageId } = await result.json()
        uploadedItems.push({ id: storageId, url: localUrl, isLocal: true })
      }

      onChange([...value, ...uploadedItems])
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
      event.target.value = ""
    }
  }

  const handleRemove = (index: number) => {
    const newItems = value.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const canAddMore = value.length < maxImages

  return (
    <div className="space-y-4 w-full">
      {label && (
        <p className="text-sm text-zinc-500">{label}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((item, index) => (
          <div
            key={item.id}
            className="relative aspect-video rounded-lg border border-zinc-200 overflow-hidden group"
          >
            <img
              src={item.url}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 rounded-full bg-rose-500 p-1 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
              disabled={disabled}
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {canAddMore && (
          <div
            className={cn(
              "relative aspect-video flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 transition-all hover:bg-zinc-50/50 cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex flex-col items-center justify-center">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              ) : (
                <>
                  <Plus className="h-6 w-6 text-zinc-400" />
                  <span className="mt-1 text-xs text-zinc-500">
                    {value.length}/{maxImages}
                  </span>
                </>
              )}
            </div>
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={onUpload}
              disabled={disabled || isUploading}
              accept="image/*"
              multiple
            />
          </div>
        )}
      </div>
    </div>
  )
}
