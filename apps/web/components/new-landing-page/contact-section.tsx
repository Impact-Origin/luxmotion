"use client"

import { useState } from "react"
import Image from "next/image"
import { User, Mail, Phone, MessageSquare, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@workspace/ui/lib/utils"
import { useMutation } from "convex/react"
import { api } from "@workspace/convex/api"
import { toast } from "sonner"

export function ContactSection() {
  const t = useTranslations("contact")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submitContact = useMutation(api.contactSubmissions.submit)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await submitContact({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      })
      toast.success(t("submitSuccess"))
      setFormData({ fullName: "", email: "", phone: "", message: "" })
    } catch {
      toast.error(t("submitError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="bg-white px-4 md:px-5 lg:px-6 xl:px-8 pb-[60px]">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative border border-[#bceeff] rounded-[16px] overflow-hidden flex flex-col md:flex-row"
          style={{
            boxShadow:
              "0px -1.41px 22.553px 0px rgba(0,0,0,0.05), 0px 31.01px 33.83px 0px rgba(0,0,0,0.07)",
          }}
        >
          <div className="relative w-full md:w-[38%] h-[240px] md:h-auto md:min-h-[700px] shrink-0">
            <Image
              src="/contact_background.jpg"
              alt="Ready to explore"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 38vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <h2 className="absolute top-[24px] left-[22px] text-[40px] md:text-[83px] font-bold text-white leading-[1.13] w-[236px] md:w-[401px]">
              {t("heroTitle")}
            </h2>
          </div>

          <div className="bg-white flex flex-col gap-[47px] p-[24px] pb-[24px] pt-[16px] md:p-[48px] w-full">
            <div className="flex flex-col gap-[11px]">
              <h3 className="text-[24px] md:text-[32px] font-bold text-[#222222] leading-[1.3]">
                {t("title")}
              </h3>
              <p className="text-[16px] text-[#65758b] leading-[24px]">
                {t("description")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] items-center w-full">
              <div className="relative w-full">
                <div className="absolute left-[8px] top-1/2 -translate-y-1/2">
                  <User className="size-[24px] text-[#27c7ff]" />
                </div>
                <input
                  suppressHydrationWarning
                  type="text"
                  placeholder={t("fullName")}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-[48px] pl-[41px] pr-[8px] py-[12px] border border-[#bfbfbf] rounded-[6px] text-[14px] text-[#222222] placeholder:text-[#a2a2a2] outline-none focus:border-[#27c7ff] transition-colors"
                />
              </div>

              <div className="relative w-full">
                <div className="absolute left-[8px] top-1/2 -translate-y-1/2">
                  <Mail className="size-[24px] text-[#27c7ff]" />
                </div>
                <input
                  suppressHydrationWarning
                  type="email"
                  placeholder={t("email")}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-[48px] pl-[41px] pr-[8px] py-[12px] border border-[#bfbfbf] rounded-[6px] text-[14px] text-[#222222] placeholder:text-[#a2a2a2] outline-none focus:border-[#27c7ff] transition-colors"
                />
              </div>

              <div className="relative w-full">
                <div className="absolute left-[8px] top-1/2 -translate-y-1/2">
                  <Phone className="size-[24px] text-[#27c7ff]" />
                </div>
                <input
                  suppressHydrationWarning
                  type="tel"
                  placeholder={t("phone")}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-[48px] pl-[41px] pr-[8px] py-[12px] border border-[#bfbfbf] rounded-[6px] text-[14px] text-[#222222] placeholder:text-[#a2a2a2] outline-none focus:border-[#27c7ff] transition-colors"
                />
              </div>

              <div className="relative w-full">
                <div className="absolute left-[8px] top-[12px]">
                  <MessageSquare className="size-[24px] text-[#27c7ff]" />
                </div>
                <textarea
                  suppressHydrationWarning
                  placeholder={t("message")}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full h-[119px] pl-[41px] pr-[8px] py-[12px] border border-[#bfbfbf] rounded-[6px] text-[14px] text-[#222222] placeholder:text-[#a2a2a2] outline-none focus:border-[#27c7ff] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[244px] h-[48px] bg-[#27c7ff] hover:bg-[#1fb8ed] disabled:opacity-50 rounded-[8px] text-[16px] font-bold text-[#0e4659] uppercase tracking-[0.16px] transition-colors"
              >
                {isSubmitting ? "..." : t("send")}
              </button>
            </form>

            <div className="flex flex-col gap-[16px] items-center w-full">
              <div className="border border-[#bfbfbf] rounded-[16px] p-[16px] md:p-[24px] flex gap-[16px] items-center w-fit">
                <div className="relative size-[64px] md:size-[120px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src="/hf_20260219_183309_b93acb5b-325f-4a23-b042-0be3879e6f56.png"
                    alt="Carolina Pinheiro"
                    fill
                    className="object-cover rounded-full"
                    style={{ objectPosition: "50% 22%" }}
                  />
                </div>
                <div className="flex flex-col gap-[16px] flex-1">
                  <h4 className="text-[18px] md:text-[24px] font-bold text-[#222222] leading-[1.3]">
                    {t("supportName")}
                  </h4>
                  <div className="flex flex-col gap-[8px]">
                    <div className="flex items-center gap-[8px]">
                      <Phone className="size-[24px] text-[#27c7ff]" />
                      <span className="text-[14px] md:text-[16px] text-[#222222] leading-[14px]">
                        {t("supportPhone")}
                      </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <Mail className="size-[24px] text-[#27c7ff]" />
                      <span className="text-[14px] md:text-[16px] text-[#222222] leading-[1.2] break-all">
                        {t("supportEmail")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-[8px]">
                <CheckCircle2 className="size-[16px] text-[#27c7ff]" />
                <span className="text-[14px] text-[#65758b] leading-[20px]">
                  {t("responseTime")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
