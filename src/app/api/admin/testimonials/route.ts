import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { testimonialSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ testimonials });
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
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }
  const t = await prisma.testimonial.create({
    data: { ...parsed.data, avatar: parsed.data.avatar || null },
  });
  revalidatePublicPaths(["/"]);
  return NextResponse.json({ testimonial: t }, { status: 201 });
}
