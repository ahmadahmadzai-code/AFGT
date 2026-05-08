import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { postSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

interface RouteCtx {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = postSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = parsed.data;
  const transitioningToPublished =
    data.status === "PUBLISHED" && existing.status !== "PUBLISHED";

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      ...data,
      publishedAt: transitioningToPublished
        ? data.publishedAt ?? new Date()
        : data.publishedAt ?? existing.publishedAt,
    },
  });
  revalidatePublicPaths(["/blog", `/blog/${post.slug}`]);
  if (existing.slug !== post.slug) {
    revalidatePublicPaths([`/blog/${existing.slug}`]);
  }
  return NextResponse.json({ post });
}

export async function DELETE(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.post.delete({ where: { id: params.id } });
  revalidatePublicPaths(["/blog", `/blog/${post.slug}`]);
  return NextResponse.json({ ok: true });
}
