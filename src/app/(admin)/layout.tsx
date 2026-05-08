import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

export const metadata = {
  title: { default: "Admin", template: "%s · AFG Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const showSidebar = !!session?.user?.id;

  return (
    <div className="flex min-h-screen bg-ink-950 text-white">
      {showSidebar ? <AdminSidebar /> : null}
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
