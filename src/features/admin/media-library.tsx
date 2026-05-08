"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, Copy, Loader2 } from "lucide-react";
import type { Media } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Props { initial: Media[] }

export function MediaLibrary({ initial }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string>("");
  const [error, setError] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "Upload failed");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(""), 2000);
    } catch {/* no-op */}
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-ink-200/70">{initial.length} files in library</p>
        <Button size="sm" onClick={() => inputRef.current?.click()} loading={uploading}>
          <Upload className="h-4 w-4" /> Upload
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
      </div>

      {error ? <p className="mb-4 text-xs text-red-400">{error}</p> : null}

      {initial.length === 0 ? (
        <Card className="p-12 text-center text-ink-300/70">
          {uploading ? (
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</span>
          ) : (
            "Library is empty — upload your first image."
          )}
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {initial.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <Image src={m.url} alt={m.alt ?? m.filename} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" unoptimized />
              </div>
              <div className="p-3">
                <div className="truncate font-mono text-xs text-ink-200" title={m.filename}>{m.filename}</div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-ink-300/70">
                  <span>{Math.round(m.size / 1024)} KB</span>
                  <button
                    type="button"
                    onClick={() => copyUrl(m.url)}
                    className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-mint hover:bg-mint/10"
                  >
                    <Copy className="h-3 w-3" /> {copied === m.url ? "Copied!" : "Copy URL"}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
