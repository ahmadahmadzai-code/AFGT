import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/api-auth";
import { uploadBufferToS3 } from "@/lib/s3";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 413 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 415 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await uploadBufferToS3(buffer, file.name, file.type);

  const media = await prisma.media.create({
    data: {
      url: result.url,
      key: result.key,
      filename: result.filename,
      mimeType: result.mimeType,
      size: result.size,
      uploadedBy: guard.session.user.id,
    },
  });

  return NextResponse.json({ media }, { status: 201 });
}

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ media });
}
