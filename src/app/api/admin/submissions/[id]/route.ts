import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { submissionUpdateSchema } from "@/features/admin/schemas";

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
  const parsed = submissionUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const submission = await prisma.contactSubmission.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ submission });
}

export async function DELETE(_req: Request, { params }: RouteCtx) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  await prisma.contactSubmission.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
