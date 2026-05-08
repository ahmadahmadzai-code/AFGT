import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { siteSettingsSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 422 });
  }
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { ...parsed.data, seoImage: parsed.data.seoImage || null },
    create: { id: "singleton", ...parsed.data, seoImage: parsed.data.seoImage || null },
  });
  revalidatePublicPaths(["/", "/about", "/contact"]);
  return NextResponse.json({ settings });
}
