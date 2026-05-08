import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { serviceSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

interface RouteCtx {
  params: { id: string };
}

export async function GET(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ service });
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
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const existing = await prisma.service.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const service = await prisma.service.update({ where: { id: params.id }, data: parsed.data });
  revalidatePublicPaths(["/", "/services", `/services/${service.slug}`]);
  if (existing.slug !== service.slug) {
    revalidatePublicPaths([`/services/${existing.slug}`]);
  }
  return NextResponse.json({ service });
}

export async function DELETE(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.service.delete({ where: { id: params.id } });
  revalidatePublicPaths(["/", "/services", `/services/${service.slug}`]);
  return NextResponse.json({ ok: true });
}
