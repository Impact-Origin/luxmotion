import { createNoIndexMetadata } from "@/lib/seo"

export const metadata = createNoIndexMetadata("Blog Results")

export default function BlogResultsLayout({ children }: { children: React.ReactNode }) {
  return children
}
