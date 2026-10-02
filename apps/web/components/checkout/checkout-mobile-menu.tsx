"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { ChevronDown, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { getHeaderLinks } from "@/components/new-landing-page/header-links"
import { useCheckoutTheme } from "./checkout-theme"

export function CheckoutMobileMenu() {
  const [open, setOpen] = useState(false)
  const t = useTranslations("header")
  const tNav = useTranslations("checkout.nav")
  const { theme } = useCheckoutTheme()

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener("change", closeOnDesktop)
    return () => media.removeEventListener("change", closeOnDesktop)
  }, [])

  const linkClass = "block py-3 text-sm uppercase tracking-wider hover:text-[var(--ck-accent)] focus-visible:text-[var(--ck-accent)]"

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={tNav("menu")}
          className="md:hidden flex shrink-0 items-center justify-center size-[36px] border border-[rgba(var(--ck-accent-rgb,201,169,110),0.22)] text-[var(--ck-accent,#c9a96e)] hover:border-[rgba(var(--ck-accent-rgb,201,169,110),0.4)] transition-colors cursor-pointer"
        >
          <Menu className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            // The portal is outside the provider's wrapper: apply its theme here too.
            "checkout-theme fixed inset-x-0 top-0 z-[101] flex max-h-[90dvh] flex-col border-b border-[var(--ck-divider)] bg-[var(--ck-bg)] text-[var(--ck-text)] shadow-2xl",
            theme,
          )}
        >
          <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[var(--ck-divider)] px-4">
            <Dialog.Title className="text-sm font-medium uppercase tracking-wider">{tNav("menu")}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" aria-label={tNav("close")} className="flex size-11 items-center justify-center text-[var(--ck-accent)] cursor-pointer">
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>
          <nav aria-label={tNav("menu")} className="min-h-0 overflow-y-auto px-4 pb-4">
            <ul>
              {getHeaderLinks(t).map((link) => (
                <li key={link.label} className="border-b border-[var(--ck-divider)] last:border-0">
                  {link.hasDropdown ? (
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm uppercase tracking-wider [&::-webkit-details-marker]:hidden">
                        {link.label}
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="mb-3 ml-2 border-l border-[var(--ck-accent)] pl-4 text-[var(--ck-text-muted)]">
                        {link.items.map((item) => (
                          <li key={item.href}>
                            <Link href={item.href} className={linkClass} onClick={() => setOpen(false)}>{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={link.href!} className={linkClass} onClick={() => setOpen(false)}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
