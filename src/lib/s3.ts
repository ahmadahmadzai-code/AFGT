import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

const region = process.env.AWS_REGION ?? "us-east-1";
const bucket = process.env.S3_BUCKET ?? "";
const publicBase =
  process.env.S3_PUBLIC_BASE_URL ?? `https://${bucket}.s3.${region}.amazonaws.com`;

export const s3 = new S3Client({
  region,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  mimeType: string;
  size: number;
}

export async function uploadBufferToS3(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  prefix = "uploads",
): Promise<UploadResult> {
  if (!bucket) throw new Error("S3_BUCKET env var is not set");

  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${prefix}/${Date.now()}-${randomUUID().slice(0, 8)}-${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return {
    url: `${publicBase}/${key}`,
    key,
    filename: safeName,
    mimeType,
    size: buffer.length,
  };
}

export async function deleteFromS3(key: string): Promise<void> {
  if (!bucket) return;
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
