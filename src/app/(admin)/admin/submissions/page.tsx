import { AdminShell } from "@/components/layout/admin-shell";
import { SubmissionsInbox } from "@/features/admin/tables/submissions-inbox";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <AdminShell title="Inbox" description="Inbound contact-form submissions.">
      <SubmissionsInbox initial={submissions} />
    </AdminShell>
  );
}
