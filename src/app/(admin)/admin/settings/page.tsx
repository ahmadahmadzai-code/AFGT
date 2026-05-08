import { AdminShell } from "@/components/layout/admin-shell";
import { SettingsForm } from "@/features/admin/editors/settings-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return (
    <AdminShell title="Site settings" description="Brand, contact, and SEO defaults.">
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
