"use client"

import * as React from "react"
import { X, Loader2, Plus } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { cn } from "@workspace/ui/lib/utils"

export interface MediaItem {
  id: string
  url: string
  type: "image" | "video"
  isLocal?: boolean
}

interface MultiMediaUploadProps {
  value: MediaItem[]
  onChange: (items: MediaItem[]) => void
  disabled?: boolean
  maxItems?: number
  label?: string
}

export function MultiMediaUpload({
  value,
  onChange,
  disabled,
  maxItems = 15,
  label,
}: MultiMediaUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const generateUploadUrl = useMutation(api.blogs.generateUploadUrl)

  const onUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const remainingSlots = maxItems - value.length
    if (remainingSlots <= 0) return

    const filesToUpload = Array.from(files).slice(0, remainingSlots).filter((f) =>
      f.type.startsWith("image/") || f.type === "video/mp4" || f.type === "video/webm"
    )

    try {
      setIsUploading(true)

      const uploadedItems: MediaItem[] = []

      for (const file of filesToUpload) {
        const localUrl = URL.createObjectURL(file)
        const mediaType = file.type.startsWith("video/") ? "video" : "image"

        const postUrl = await generateUploadUrl()
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        })

        const { storageId } = await result.json()
        uploadedItems.push({ id: storageId, url: localUrl, type: mediaType, isLocal: true })
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

  const canAddMore = value.length < maxItems

  return (
    <div className="space-y-4 w-full">
      {label && (
        <p className="text-sm text-[#8a8074]">{label}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {value.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="relative aspect-video rounded-lg border border-[#e7ddca] overflow-hidden group"
          >
            {item.type === "video" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#221c15]">
                <video
                  src={item.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            ) : (
              <img
                src={item.url}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-1 right-1 flex items-center gap-1">
              <span className="bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                {item.type === "video" ? "Vídeo" : "Img"}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="rounded-full bg-rose-500 p-1 text-white hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {canAddMore && (
          <div
            className={cn(
              "relative aspect-video flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#e7ddca] transition-all hover:bg-[#A08248]/[0.06]/50 cursor-pointer",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex flex-col items-center justify-center">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#a99e8c]" />
              ) : (
                <>
                  <Plus className="h-6 w-6 text-[#a99e8c]" />
                  <span className="mt-1 text-xs text-[#8a8074]">
                    {value.length}/{maxItems}
                  </span>
                  <span className="mt-0.5 text-[10px] text-[#a99e8c]">Img ou Vídeo</span>
                </>
              )}
            </div>
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={onUpload}
              disabled={disabled || isUploading}
              accept="image/*,video/mp4,video/webm"
              multiple
            />
          </div>
        )}
      </div>
    </div>
  )
}
