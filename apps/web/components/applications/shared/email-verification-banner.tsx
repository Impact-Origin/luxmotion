import { Mail } from "lucide-react"

interface EmailVerificationBannerProps {
  email: string
}

export function EmailVerificationBanner({ email }: EmailVerificationBannerProps) {
  return (
    <div className="flex items-center justify-center gap-2 h-[40px] w-full bg-[#ede8df] px-3">
      <Mail size={16} strokeWidth={1.6} className="text-[#a08248] shrink-0" />
      <span className="text-[14px] font-semibold text-black truncate">{email}</span>
    </div>
  )
}
