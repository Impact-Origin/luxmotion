"use client"

import { useQuery } from "convex/react"
import { api } from "@workspace/convex/api"
import { useTranslations } from "next-intl"
import { Users } from "lucide-react"
import Image from "next/image"

export function TeamSection() {
  const t = useTranslations("aboutPage.team")
  const members = useQuery(api.teamMembers.listPublished)

  if (!members) return null

  return (
    <section className="px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[36px]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        <div className="text-center flex flex-col gap-3 items-center">
          <h2 className="text-[24px] md:text-[32px] font-bold text-[#222]">
            {t("title")}
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#65758b] leading-[1.4] max-w-[600px]">
            {t("subtitle")}
          </p>
        </div>

        {members.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {members.map((member) => (
              <div
                key={member._id}
                className="relative aspect-[3/4] rounded-[12px] overflow-hidden group"
              >
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="size-full bg-zinc-100 flex items-center justify-center">
                    <Users className="h-12 w-12 text-zinc-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="font-bold text-[18px] text-white leading-tight">
                    {member.name}
                  </p>
                  <p className="text-[14px] text-white/80 mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
