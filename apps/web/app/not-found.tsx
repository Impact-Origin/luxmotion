import { Header } from "@/components/new-landing-page/header"
import { Footer } from "@/components/new-landing-page/footer"
import { NotFoundContent } from "@/components/not-found-content"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <NotFoundContent />
      <Footer />
    </div>
  )
}
