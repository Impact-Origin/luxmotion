import { AdminFrame } from "@/components/admin/admin-frame";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata = createNoIndexMetadata("Admin Dashboard");

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-theme h-screen overflow-hidden bg-background">
      <AdminFrame>{children}</AdminFrame>
    </div>
  );
}
