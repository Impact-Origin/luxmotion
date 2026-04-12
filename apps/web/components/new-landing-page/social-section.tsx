"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Instagram } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "convex/react"
import { api } from "@workspace/convex/api"

const fallbackPosts = [
  { id: "1", media_url: "/instagram/post-1.png", permalink: "https://www.instagram.com/luxmotion.tours/" },
  { id: "2", media_url: "/instagram/post-2.png", permalink: "https://www.instagram.com/luxmotion.tours/" },
  { id: "3", media_url: "/instagram/post-3.png", permalink: "https://www.instagram.com/luxmotion.tours/" },
  { id: "4", media_url: "/instagram/post-2.png", permalink: "https://www.instagram.com/luxmotion.tours/" },
  { id: "5", media_url: "/instagram/post-3.png", permalink: "https://www.instagram.com/luxmotion.tours/" },
  { id: "6", media_url: "/instagram/post-1.png", permalink: "https://www.instagram.com/luxmotion.tours/" },
]

export function SocialSection() {
  const t = useTranslations("social")
  const getInstagramData = useAction(api.instagram.getInstagramData)

  const [posts, setPosts] = useState(fallbackPosts)
  const [profile, setProfile] = useState({
    username: "luxmotion.tours",
    media_count: 626,
    followers_count: 2000,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInstagramData({ postsLimit: 6 })
        if (!data.error && data.posts?.length) {
          setPosts(
            data.posts.map((p: { id: string; media_url: string; permalink: string; thumbnail_url?: string }) => ({
              id: p.id,
              media_url: p.thumbnail_url || p.media_url,
              permalink: p.permalink,
            }))
          )
        }
        if (data.profile) {
          setProfile({
            username: data.profile.username,
            media_count: data.profile.media_count,
            followers_count: data.profile.followers_count,
          })
        }
      } catch {
        // fallback already set
      }
    }
    fetchData()
  }, [getInstagramData])

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

  return (
    <section className="bg-[#0D0D0D] py-6 px-4 md:px-[82px] 2xl:px-[300px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 border border-[rgba(201,169,110,0.4)] flex items-center justify-center shrink-0">
              <Instagram className="w-4 h-4 text-[#C9A96E]" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span
                className="text-[16px] text-white tracking-[0.65px]"
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                @{profile.username}
              </span>
              <span
                className="text-[8px] text-[#8C8680] tracking-[0.8px]"
                style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
              >
                {profile.media_count} {t("posts")} · {formatCount(profile.followers_count)} {t("followers")}
              </span>
            </div>
          </div>

          <a
            href="https://www.instagram.com/luxmotion.tours/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] tracking-[1.1px] uppercase text-[#C9A96E] font-semibold hover:text-white transition-colors hidden md:block"
            style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            {t("followJourney")} →
          </a>
        </div>

        <div className="grid grid-cols-2 md:flex gap-[2px]">
          {posts.slice(0, 6).map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-[1/1.1] md:aspect-square md:min-h-[300px] md:flex-1 bg-[#1A1A1A] overflow-hidden hover:opacity-80 transition-opacity"
            >
              <Image
                src={post.media_url}
                alt="Instagram post"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 16vw"
                unoptimized={post.media_url.startsWith("http")}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
