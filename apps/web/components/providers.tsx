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
        enableSystem={false}
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </NextThemesProvider>
    </NextIntlClientProvider>
  )
}
