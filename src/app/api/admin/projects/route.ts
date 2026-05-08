import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { projectSchema } from "@/features/admin/schemas";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const projects = await prisma.project.findMany({
    orderBy: [{ updatedAt: "desc" }],
  });
  return NextResponse.json({ projects });
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
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const project = await prisma.project.create({
    data: {
      ...data,
      publishedAt: data.published ? new Date() : null,
      authorId: guard.session.user.id,
    },
  });

  revalidatePublicPaths(["/", "/portfolio", `/portfolio/${project.slug}`]);
  return NextResponse.json({ project }, { status: 201 });
}
