import Link from "next/link";
import { FolderKanban, Wrench, Newspaper, Inbox as InboxIcon, Quote, ImagePlus } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    projectsCount,
    publishedProjects,
    servicesCount,
    postsCount,
    publishedPosts,
    submissionsNew,
    testimonialsCount,
    mediaCount,
    recentSubmissions,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.service.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
    prisma.testimonial.count(),
    prisma.media.count(),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const stats = [
    { label: "Projects", value: `${publishedProjects} / ${projectsCount}`, helper: "published / total", icon: FolderKanban, href: "/admin/projects" },
    { label: "Services", value: String(servicesCount), helper: "configured", icon: Wrench, href: "/admin/services" },
    { label: "Posts", value: `${publishedPosts} / ${postsCount}`, helper: "published / total", icon: Newspaper, href: "/admin/posts" },
    { label: "Inbox · NEW", value: String(submissionsNew), helper: "awaiting reply", icon: InboxIcon, href: "/admin/submissions" },
    { label: "Testimonials", value: String(testimonialsCount), helper: "on file", icon: Quote, href: "/admin/testimonials" },
    { label: "Media", value: String(mediaCount), helper: "files in library", icon: ImagePlus, href: "/admin/media" },
  ];

  return (
    <AdminShell
      title="Dashboard"
      description="An overview of the AFG Tech site at a glance."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card glow className="p-6 transition-colors hover:bg-white/[0.04]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-300/70">
                      {s.label}
                    </p>
                    <p className="mt-3 font-display text-3xl font-semibold text-white">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs text-ink-200/60">{s.helper}</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint ring-1 ring-mint/20">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">
              Recent inquiries
            </h2>
            <p className="text-xs text-ink-300/70">
              The latest contact-form submissions.
            </p>
          </div>
          <Link
            href="/admin/submissions"
            className="text-xs font-medium uppercase tracking-[0.18em] text-mint hover:text-mint-400"
          >
            View all
          </Link>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-[0.18em] text-ink-300/70">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-ink-300/70">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                recentSubmissions.map((s) => (
                  <tr key={s.id} className="border-b border-white/[0.04] last:border-0">
                    <td className="px-5 py-3">
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-xs text-ink-300/70">{s.email}</div>
                    </td>
                    <td className="px-5 py-3 text-ink-100">{s.company ?? "—"}</td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-200">
                      {s.budget ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={s.status === "NEW" ? "mint" : s.status === "CONTACTED" ? "warning" : "neutral"}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink-300/70">
                      {formatDate(s.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminShell>
  );
}
