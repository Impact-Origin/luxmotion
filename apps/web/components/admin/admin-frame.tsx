"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

const SERIF = "var(--font-title), 'Cormorant Garamond', serif";

export function AdminFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The sign-in route is public and gets its own full-screen layout — no shell.
  if (pathname?.startsWith("/admin/sign-in")) {
    return <>{children}</>;
  }

  return (
    <GoogleMapsProvider>
      <div className="flex min-h-screen w-full bg-[#f6f1e9] text-[#211c16] antialiased">
        <AdminSidebar />

        <div className="flex flex-1 flex-col overflow-clip">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-[#e7ddca] bg-[#fffdf9]/85 px-6 backdrop-blur lg:px-8">
            <div className="flex items-center gap-3">
              <span aria-hidden className="h-4 w-[3px] rounded-full bg-[#A08248]" />
              <h1 className="text-[21px] leading-none text-[#211c16]" style={{ fontFamily: SERIF }}>
                Painel de administração
              </h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[1.3px] text-[#8a8074]">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#A08248]" />
              <span suppressHydrationWarning>
                {new Date().toLocaleDateString("pt-PT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
