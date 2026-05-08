import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";

export const runtime = "nodejs";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ submissions });
}
