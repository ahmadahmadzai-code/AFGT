import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { postSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const data = parsed.data;
  const post = await prisma.post.create({
    data: {
      ...data,
      publishedAt:
        data.status === "PUBLISHED"
          ? data.publishedAt ?? new Date()
          : null,
      authorId: guard.session.user.id,
    },
  });
  revalidatePublicPaths(["/blog", `/blog/${post.slug}`]);
  return NextResponse.json({ post }, { status: 201 });
}
