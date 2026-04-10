"use client"

import Image from "next/image"
import Link from "next/link"
import { Share2, ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

export interface BlogResult {
  id: string
  slug: string
  image: string
  location: string
  title: string
  date: string
  description: string
}

interface BlogResultCardProps {
  blog: BlogResult
}

export function BlogResultCard({ blog }: BlogResultCardProps) {
  const t = useTranslations("blogResults")

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: `/blogs/${blog.slug}`,
        })
      } catch {
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.slug}`)
    }
  }

  return (
    <div className="border border-[#e8e8e8] rounded-[16px] overflow-hidden w-full">
      <div className="hidden md:flex">
        <div className="relative w-1/2 h-[244px]">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute top-[16px] left-[16px]">
            <div className="bg-[#27c7ff] rounded-[80px] h-[32px] px-[16px] flex items-center justify-center">
              <span className="text-[14px] font-medium text-white">{blog.location}</span>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-white px-[16px] py-[12px] flex flex-col">
          <div className="flex items-start justify-between w-full">
            <h3 className="text-[24px] font-bold text-[#222] leading-[1.2] flex-1 pr-[8px]">
              {blog.title}
            </h3>
            <button
              onClick={handleShare}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label={t("share")}
            >
              <Share2 className="size-[20px] text-[#808080]" />
            </button>
          </div>

          <p className="text-[12px] font-medium text-[#808080] mt-[6px]">
            {blog.date}
          </p>

          <p className="text-[14px] text-[#0e4659] leading-[1.3] mt-[6px]">
            {blog.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-[12px]">
            <Link
              href={`/blogs/${blog.slug}`}
              className="text-[16px] font-bold text-[#1f9fcc] tracking-[-0.2px] hover:underline"
            >
              {t("readMore")}
            </Link>
            <Link
              href={`/blogs/${blog.slug}`}
              className="size-[28px] bg-[#27c7ff] rounded-full flex items-center justify-center hover:brightness-95 transition-all"
            >
              <ArrowRight className="size-[18px] text-white" />
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden flex flex-col">
        <div className="relative w-full h-[244px]">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute top-[16px] left-[16px]">
            <div className="bg-[#27c7ff] rounded-[80px] h-[32px] px-[16px] flex items-center justify-center">
              <span className="text-[14px] font-medium text-white">{blog.location}</span>
            </div>
          </div>
        </div>

        <div className="bg-white px-[16px] py-[12px] flex flex-col gap-[6px]">
          <div className="flex items-start justify-between w-full">
            <h3 className="text-[16px] font-bold text-[#222] leading-[1.2] flex-1 pr-[8px]">
              {blog.title}
            </h3>
            <button
              onClick={handleShare}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label={t("share")}
            >
              <Share2 className="size-[20px] text-[#808080]" />
            </button>
          </div>

          <p className="text-[12px] font-medium text-[#808080]">
            {blog.date}
          </p>

          <p className="text-[14px] text-[#0e4659] leading-[1.3]">
            {blog.description}
          </p>

          <div className="flex items-center justify-between">
            <Link
              href={`/blogs/${blog.slug}`}
              className="text-[16px] font-bold text-[#1f9fcc] tracking-[-0.2px] hover:underline"
            >
              {t("readMore")}
            </Link>
            <Link
              href={`/blogs/${blog.slug}`}
              className="size-[28px] bg-[#27c7ff] rounded-full flex items-center justify-center hover:brightness-95 transition-all"
            >
              <ArrowRight className="size-[18px] text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
