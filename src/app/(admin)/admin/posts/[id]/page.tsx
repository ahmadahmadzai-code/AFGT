import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/admin-shell";
import { PostForm } from "@/features/admin/editors/post-form";
import { prisma } from "@/lib/prisma";

interface PageProps { params: { id: string } }

export default async function EditPostPage({ params }: PageProps) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <AdminShell title={post.title} description={`Edit post · /${post.slug}`}>
      <PostForm initial={post} />
    </AdminShell>
  );
}
