"use client"

import { useEffect, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface BlogDetailHeroProps {
  imageUrl?: string | null
}

export function BlogDetailHero({ imageUrl }: BlogDetailHeroProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const backgroundImage = imageUrl || "/blogs_details_hero.png"

  return (
    <section
      className={cn(
        "relative w-full h-[300px] md:h-[400px] lg:h-[450px] overflow-hidden transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
    </section>
  )
}
