import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { testimonialSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

interface RouteCtx {
  params: { id: string };
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
  const parsed = testimonialSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const t = await prisma.testimonial.update({
    where: { id: params.id },
    data: { ...parsed.data, avatar: parsed.data.avatar ? parsed.data.avatar : undefined },
  });
  revalidatePublicPaths(["/"]);
  return NextResponse.json({ testimonial: t });
}

export async function DELETE(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  await prisma.testimonial.delete({ where: { id: params.id } });
  revalidatePublicPaths(["/"]);
  return NextResponse.json({ ok: true });
}
