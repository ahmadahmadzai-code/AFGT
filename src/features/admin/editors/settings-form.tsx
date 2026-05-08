"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import type { SiteSettings } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { siteSettingsSchema, type SiteSettingsInput } from "@/features/admin/schemas";
import { api } from "@/lib/api";

interface Props { initial: SiteSettings | null }

export function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const socials = (initial?.socials as Record<string, string> | null) ?? {};

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: initial?.siteName ?? "AFG Tech",
      tagline: initial?.tagline ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      address: initial?.address ?? "",
      socials: {
        linkedin: socials.linkedin ?? "",
        twitter: socials.twitter ?? "",
        github: socials.github ?? "",
      },
      seoImage: initial?.seoImage ?? "",
    },
  });

  const onSubmit = async (data: SiteSettingsInput) => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.patch("/api/admin/settings", data);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 space-y-5">
        <h3 className="font-display text-base font-semibold text-white">Identity</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Site name" required error={errors.siteName?.message}>
            <Input {...register("siteName")} error={!!errors.siteName} />
          </Field>
          <Field label="Tagline" required error={errors.tagline?.message}>
            <Input {...register("tagline")} error={!!errors.tagline} />
          </Field>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 space-y-5">
        <h3 className="font-display text-base font-semibold text-white">Contact</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email" required error={errors.email?.message}>
            <Input type="email" {...register("email")} error={!!errors.email} />
          </Field>
          <Field label="Phone" required error={errors.phone?.message}>
            <Input {...register("phone")} error={!!errors.phone} />
          </Field>
        </div>
        <Field label="Address" required error={errors.address?.message}>
          <Input {...register("address")} error={!!errors.address} />
        </Field>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 space-y-5">
        <h3 className="font-display text-base font-semibold text-white">Socials</h3>
        <Field label="LinkedIn"><Input type="url" {...register("socials.linkedin")} placeholder="https://www.linkedin.com/company/afgtech" /></Field>
        <Field label="Twitter / X"><Input type="url" {...register("socials.twitter")} placeholder="https://twitter.com/afgtech" /></Field>
        <Field label="GitHub"><Input type="url" {...register("socials.github")} placeholder="https://github.com/afgtech" /></Field>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 space-y-5">
        <h3 className="font-display text-base font-semibold text-white">SEO</h3>
        <Field label="Default OG image URL" error={errors.seoImage?.message}>
          <Input type="url" {...register("seoImage")} placeholder="https://…" />
        </Field>
      </div>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" /><span>{error}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-end gap-3">
        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-mint">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved
          </span>
        ) : null}
        <Button type="submit" loading={saving}>
          <Save className="h-4 w-4" /> Save settings
        </Button>
      </div>
    </form>
  );
}
