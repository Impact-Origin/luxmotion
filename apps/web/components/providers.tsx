"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { NextIntlClientProvider } from "next-intl"
import { Toaster } from "@workspace/ui/components/sonner"

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: Record<string, unknown>
  timeZone: string
}

export function Providers({ children, locale, messages, timeZone }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        forcedTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          style={
            {
              "--normal-bg": "#1a1a1a",
              "--normal-text": "#ffffff",
              "--normal-border": "rgba(201,169,110,0.22)",
              "--success-bg": "#1a1a1a",
              "--success-text": "#ffffff",
              "--success-border": "rgba(201,169,110,0.22)",
              "--error-bg": "#1a1a1a",
              "--error-text": "#ffffff",
              "--error-border": "rgba(155,44,44,0.6)",
              "--info-bg": "#1a1a1a",
              "--info-text": "#ffffff",
              "--info-border": "rgba(201,169,110,0.22)",
              "--warning-bg": "#1a1a1a",
              "--warning-text": "#ffffff",
              "--warning-border": "rgba(201,169,110,0.4)",
              "--border-radius": "0px",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            } as React.CSSProperties
          }
          toastOptions={{
            unstyled: false,
            classNames: {
              toast:
                "!bg-[#1a1a1a] !text-white !border-y !border-r !border-y-[rgba(201,169,110,0.18)] !border-r-[rgba(201,169,110,0.18)] !border-l-2 !border-l-[#c9a96e] !rounded-none !shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] !p-[18px] !gap-[12px] !items-start",
              title:
                "!text-white !font-semibold !text-[13px] !tracking-[0.3px] !leading-[1.4]",
              description:
                "!text-[rgba(255,255,255,0.55)] !text-[12px] !leading-[1.5] !mt-[2px]",
              actionButton:
                "!bg-[#c9a96e] !text-[#0d0d0d] !rounded-none !text-[10px] !font-bold !uppercase !tracking-[1.32px] !px-[12px] !py-[8px] hover:!bg-[#b8954f]",
              cancelButton:
                "!bg-transparent !text-[#c9a96e] !border !border-[rgba(201,169,110,0.4)] !rounded-none !text-[10px] !font-bold !uppercase !tracking-[1.32px] !px-[12px] !py-[8px] hover:!bg-[rgba(201,169,110,0.08)]",
              closeButton:
                "!bg-[#1a1a1a] !text-[#c9a96e] !border !border-[rgba(201,169,110,0.3)] !rounded-full hover:!bg-[rgba(201,169,110,0.08)]",
              icon: "!text-[#c9a96e] !size-[18px] !shrink-0 !mt-[1px]",
              success: "!text-[#c9a96e]",
              error: "!text-[#ef9a9a] [&_[data-icon]_svg]:!text-[#ef9a9a]",
              info: "!text-[#c9a96e]",
              warning: "!text-[#c9a96e]",
              loader: "!text-[#c9a96e]",
            },
          }}
        />
      </NextThemesProvider>
    </NextIntlClientProvider>
  )
}
