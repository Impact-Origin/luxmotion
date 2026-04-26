"use client"

import { useState } from "react"
import { FaqsHero } from "@/components/faqs/faqs-hero"
import { FaqsContent } from "./faqs-content"

export function FaqsClient() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <FaqsHero onSearch={setSearchQuery} />
      <FaqsContent searchQuery={searchQuery} />
    </>
  )
}
