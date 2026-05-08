"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2, AlertCircle } from "lucide-react";
import type { Service } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { RichTextEditor } from "@/features/admin/editors/rich-text-editor";
import { ChipsInput } from "@/features/admin/editors/chips-input";
import { serviceSchema, type ServiceInput } from "@/features/admin/schemas";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";

interface ServiceFormProps {
  initial?: Service;
  onClose: () => void;
}

export function ServiceForm({ initial, onClose }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      icon: initial?.icon ?? "Box",
      shortDesc: initial?.shortDesc ?? "",
      body: initial?.body ?? "",
      features: initial?.features ?? [],
      order: initial?.order ?? 0,
      published: initial?.published ?? true,
    },
  });

  const onSubmit = async (data: ServiceInput) => {
    setSaving(true);
    setError("");
    try {
      if (isEdit && initial) {
        await api.patch(`/api/admin/services/${initial.id}`, data);
      } else {
        await api.post("/api/admin/services", data);
      }
      router.refresh();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial) return;
    if (!confirm(`Delete service "${initial.title}"?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/services/${initial.id}`);
      router.refresh();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };

  const slug = watch("slug");
  const title = watch("title");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" required error={errors.title?.message}>
          <Input
            {...register("title")}
            error={!!errors.title}
            onBlur={(e) => { if (!slug) setValue("slug", slugify(e.target.value)); }}
          />
        </Field>
        <Field label="Slug" required error={errors.slug?.message}>
          <Input {...register("slug")} error={!!errors.slug} placeholder={slugify(title || "")} />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Icon (lucide-react name)" required error={errors.icon?.message} hint="e.g. Globe, Cloud, Brain">
          <Input {...register("icon")} error={!!errors.icon} />
        </Field>
        <Field label="Order" error={errors.order?.message}>
          <Input type="number" {...register("order")} error={!!errors.order} />
        </Field>
      </div>

      <Field label="Short description" required error={errors.shortDesc?.message}>
        <Textarea {...register("shortDesc")} error={!!errors.shortDesc} rows={2} />
      </Field>

      <Field label="Full body" required error={errors.body?.message}>
        <Controller
          control={control}
          name="body"
          render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
        />
      </Field>

      <Field label="Features">
        <Controller
          control={control}
          name="features"
          render={({ field }) => <ChipsInput value={field.value} onChange={field.onChange} placeholder="Add a feature, press Enter" />}
        />
      </Field>

      <label className="flex items-center gap-3 text-sm text-ink-100">
        <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-white/20 bg-ink-900 text-mint focus:ring-mint" />
        Published
      </label>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" /><span>{error}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-5">
        {isEdit ? (
          <Button type="button" variant="ghost" onClick={onDelete} loading={deleting} className="text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        ) : <span />}
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
}
