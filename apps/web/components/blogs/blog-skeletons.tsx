"use client"

import { Skeleton } from "@workspace/ui/components/skeleton"

export function FeaturedBlogsSkeleton() {
  return (
    <section className="bg-white px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[40px] md:py-[60px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[24px]">
        <div className="hidden md:flex h-[562px] rounded-[16px] border border-[#e8e8e8] overflow-hidden">
          <Skeleton className="w-[70%] h-full" />
          <div className="w-[30%] bg-[#27c7ff]/20 p-[24px] flex flex-col gap-[16px]">
            <Skeleton className="h-8 w-full bg-white/50" />
            <Skeleton className="h-4 w-24 bg-white/50" />
            <Skeleton className="h-20 w-full bg-white/50" />
            <div className="mt-auto flex justify-between items-center">
              <Skeleton className="h-6 w-24 bg-white/50" />
              <Skeleton className="h-8 w-8 rounded-full bg-white/50" />
            </div>
          </div>
        </div>

        <div className="md:hidden flex flex-col rounded-[16px] overflow-hidden">
          <Skeleton className="h-[340px] w-full" />
          <div className="bg-[#27c7ff]/20 p-[24px] space-y-4">
            <Skeleton className="h-8 w-full bg-white/50" />
            <Skeleton className="h-4 w-24 bg-white/50" />
            <Skeleton className="h-16 w-full bg-white/50" />
          </div>
        </div>

        <div className="flex gap-[16px] items-center justify-center">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex gap-[6px]">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </section>
  )
}

export function LatestGuidesSkeleton() {
  return (
    <section className="bg-white px-4 md:px-8 lg:px-[60px] xl:px-[100px] py-[40px] md:py-[60px]">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-[32px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] md:gap-[32px]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col border border-[#e5e5e5] rounded-[16px] overflow-hidden">
              <Skeleton className="h-[200px] md:h-[220px] w-full" />
              <div className="p-[16px] md:p-[20px] space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-5" />
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
                <div className="flex justify-between items-center pt-3">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlogDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[520px] bg-zinc-200" />

      <section className="pt-[24px] px-[16px] md:px-[60px] xl:px-[100px]">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-8 w-24 rounded-full" />

          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
          </div>

          <div className="flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </section>

      <section className="pt-[24px] pb-[40px] px-[16px] md:px-[60px] xl:px-[100px]">
        <div className="max-w-[1000px] mx-auto space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <Skeleton className="h-8 w-64 mt-8" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <Skeleton className="h-[300px] w-full rounded-lg mt-6" />

          <Skeleton className="h-8 w-80 mt-8" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </section>
    </div>
  )
}

export function BlogResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] md:gap-[32px]">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col border border-[#e5e5e5] rounded-[16px] overflow-hidden">
          <Skeleton className="h-[200px] w-full" />
          <div className="p-[16px] space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-5" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
            <div className="flex justify-between items-center pt-3">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
