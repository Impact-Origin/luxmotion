import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { NotFoundContent } from "@/components/not-found-content"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      <Header variant="light" />
      <NotFoundContent />
      <Footer />
    </div>
  )
}
