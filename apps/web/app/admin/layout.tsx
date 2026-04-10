import { AdminSidebar } from "@/components/admin/sidebar";
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Admin Dashboard");

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleMapsProvider>
      <div className="flex min-h-screen w-full bg-zinc-50 text-zinc-950 antialiased">
        <AdminSidebar />

        <div className="flex flex-1 flex-col overflow-clip">
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-8 shadow-sm">
            <h1 className="text-lg font-semibold text-zinc-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <span>
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8 lg:p-10">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </GoogleMapsProvider>
  );
}
