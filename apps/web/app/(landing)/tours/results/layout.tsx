import { createNoIndexMetadata } from "@/lib/seo"

export const metadata = createNoIndexMetadata("Tour Results")

export default function TourResultsLayout({ children }: { children: React.ReactNode }) {
  return children
}
