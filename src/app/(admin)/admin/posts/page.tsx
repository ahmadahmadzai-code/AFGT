import Link from "next/link";
import { Plus, Edit3 } from "lucide-react";
import { AdminShell } from "@/components/layout/admin-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusTone = { DRAFT: "neutral", PUBLISHED: "mint", ARCHIVED: "warning" } as const;

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <AdminShell
      title="Posts"
      description="Engineering and industry essays for the public blog."
      actions={
        <Link href="/admin/posts/new">
          <Button size="sm"><Plus className="h-4 w-4" /> New post</Button>
        </Link>
      }
    >
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] bg-white/[0.02] text-xs uppercase tracking-[0.18em] text-ink-300/70">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Author</th>
              <th className="px-5 py-3">Published</th>
              <th className="px-5 py-3">Updated</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-ink-300/70">
                  No posts yet — <Link href="/admin/posts/new" className="text-mint hover:text-mint-400">write one</Link>.
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                  <td className="px-5 py-3">
                    <div className="font-medium text-white">{p.title}</div>
                    <div className="font-mono text-xs text-ink-300/70">/{p.slug}</div>
                  </td>
                  <td className="px-5 py-3"><Badge tone={statusTone[p.status]}>{p.status}</Badge></td>
                  <td className="px-5 py-3 text-ink-100">{p.author.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-300/70">{p.publishedAt ? formatDate(p.publishedAt) : "—"}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink-300/70">{formatDate(p.updatedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/posts/${p.id}`} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-mint hover:bg-mint/10">
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </AdminShell>
  );
}
