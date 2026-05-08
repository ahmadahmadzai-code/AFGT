"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2, AlertCircle } from "lucide-react";
import type { Project } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { RichTextEditor } from "@/features/admin/editors/rich-text-editor";
import { ImageUpload } from "@/features/admin/media/image-upload";
import { ChipsInput } from "@/features/admin/editors/chips-input";
import { projectSchema, type ProjectInput } from "@/features/admin/schemas";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";

interface ProjectFormProps {
  initial?: Project;
}

export function ProjectForm({ initial }: ProjectFormProps) {
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
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      industry: initial?.industry ?? "Automotive",
      year: initial?.year ?? new Date().getFullYear(),
      summary: initial?.summary ?? "",
      body: initial?.body ?? "",
      coverImage: initial?.coverImage ?? "",
      gallery: initial?.gallery ?? [],
      technologies: initial?.technologies ?? [],
      featured: initial?.featured ?? false,
      published: initial?.published ?? false,
    },
  });

  const onSubmit = async (data: ProjectInput) => {
    setSaving(true);
    setError("");
    try {
      if (isEdit && initial) {
        await api.patch(`/api/admin/projects/${initial.id}`, data);
      } else {
        await api.post("/api/admin/projects", data);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial) return;
    if (!confirm(`Delete "${initial.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/projects/${initial.id}`);
      router.push("/admin/projects");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };

  const title = watch("title");
  const slug = watch("slug");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Field label="Title" required error={errors.title?.message}>
            <Input
              {...register("title")}
              error={!!errors.title}
              onBlur={(e) => {
                if (!slug) setValue("slug", slugify(e.target.value));
              }}
              placeholder="Lonestar Dealer Platform"
            />
          </Field>
          <Field label="Slug" required error={errors.slug?.message} hint="lowercase-with-dashes">
            <Input {...register("slug")} error={!!errors.slug} placeholder={slugify(title || "")} />
          </Field>
          <Field label="Summary" required error={errors.summary?.message}>
            <Textarea {...register("summary")} error={!!errors.summary} rows={3} />
          </Field>
          <Field label="Case study body" required error={errors.body?.message}>
            <Controller
              control={control}
              name="body"
              render={({ field }) => (
                <RichTextEditor value={field.value} onChange={field.onChange} placeholder="Tell the story…" />
              )}
            />
          </Field>
          <Field label="Gallery images">
            <Controller
              control={control}
              name="gallery"
              render={({ field }) => <ChipsInput value={field.value} onChange={field.onChange} placeholder="Paste an image URL and press Enter" />}
            />
          </Field>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 space-y-5">
            <Field label="Cover image" required error={errors.coverImage?.message}>
              <Controller
                control={control}
                name="coverImage"
                render={({ field }) => <ImageUpload value={field.value} onChange={field.onChange} />}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Industry" required error={errors.industry?.message}>
                <Input {...register("industry")} error={!!errors.industry} />
              </Field>
              <Field label="Year" required error={errors.year?.message}>
                <Input type="number" {...register("year")} error={!!errors.year} />
              </Field>
            </div>

            <Field label="Technologies">
              <Controller
                control={control}
                name="technologies"
                render={({ field }) => <ChipsInput value={field.value} onChange={field.onChange} placeholder="Next.js, AWS…" />}
              />
            </Field>

            <div className="space-y-2 border-t border-white/5 pt-4">
              <label className="flex items-center gap-3 text-sm text-ink-100">
                <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-white/20 bg-ink-900 text-mint focus:ring-mint" />
                Featured on homepage
              </label>
              <label className="flex items-center gap-3 text-sm text-ink-100">
                <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-white/20 bg-ink-900 text-mint focus:ring-mint" />
                Published
              </label>
            </div>
          </div>
        </aside>
      </div>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
        {isEdit ? (
          <Button type="button" variant="ghost" onClick={onDelete} loading={deleting} className="text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        ) : <span />}
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/projects")}>Cancel</Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> {isEdit ? "Save changes" : "Create project"}
          </Button>
        </div>
      </div>
    </form>
  );
}
