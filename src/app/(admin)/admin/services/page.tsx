import { AdminShell } from "@/components/layout/admin-shell";
import { ServicesManager } from "@/features/admin/tables/services-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return (
    <AdminShell title="Services" description="The capabilities you sell, displayed on the public site.">
      <ServicesManager initial={services} />
    </AdminShell>
  );
}
