import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/api-auth";
import { revalidatePublicPaths } from "@/lib/revalidate";

export const runtime = "nodejs";

const schema = z.object({
  paths: z.array(z.string().min(1)).min(1),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "paths is required" }, { status: 422 });
  }
  revalidatePublicPaths(parsed.data.paths);
  return NextResponse.json({ ok: true, revalidated: parsed.data.paths });
}
