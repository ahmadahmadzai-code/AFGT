import { AdminShell } from "@/components/layout/admin-shell";
import { MediaLibrary } from "@/features/admin/media/media-library";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <AdminShell title="Media library" description="Images uploaded across the site.">
      <MediaLibrary initial={media} />
    </AdminShell>
  );
}
