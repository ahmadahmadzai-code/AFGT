import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { projectSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

interface RouteCtx {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
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
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const existing = await prisma.project.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const willPublish =
    parsed.data.published === true && existing.published === false;

  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      ...parsed.data,
      publishedAt: willPublish ? new Date() : existing.publishedAt,
    },
  });

  revalidatePublicPaths(["/", "/portfolio", `/portfolio/${project.slug}`]);
  if (existing.slug !== project.slug) {
    revalidatePublicPaths([`/portfolio/${existing.slug}`]);
  }
  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.project.delete({ where: { id: params.id } });
  revalidatePublicPaths(["/", "/portfolio", `/portfolio/${project.slug}`]);
  return NextResponse.json({ ok: true });
}
