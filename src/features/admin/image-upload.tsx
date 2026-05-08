"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, className, label = "Cover image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
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
      const json = (await res.json()) as { media: { url: string } };
      onChange(json.media.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-white/10">
          <div className="relative aspect-[16/9] w-full">
            <Image src={value} alt={label} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink-950/80 text-white opacity-0 ring-1 ring-white/10 transition-opacity hover:bg-red-500/80 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-ink-950/80 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 transition-colors hover:bg-mint hover:text-ink-950"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Replace
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-ink-900/40 p-10 text-sm text-ink-200/80 transition-colors hover:border-mint/40 hover:bg-ink-900/60"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-mint" />
          ) : (
            <Upload className="h-6 w-6 text-mint" />
          )}
          <span>{uploading ? "Uploading…" : "Click to upload an image"}</span>
          <span className="text-xs text-ink-300/60">PNG, JPG, WEBP up to 10MB</span>
        </button>
      )}

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
