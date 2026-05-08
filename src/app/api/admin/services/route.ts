import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { serviceSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ services });
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
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const service = await prisma.service.create({ data: parsed.data });
  revalidatePublicPaths(["/", "/services", `/services/${service.slug}`]);
  return NextResponse.json({ service }, { status: 201 });
}
