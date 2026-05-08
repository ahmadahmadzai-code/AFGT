"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2, AlertCircle } from "lucide-react";
import type { Post } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { RichTextEditor } from "@/features/admin/editors/rich-text-editor";
import { ImageUpload } from "@/features/admin/media/image-upload";
import { ChipsInput } from "@/features/admin/editors/chips-input";
import { postSchema, type PostInput } from "@/features/admin/schemas";
import { api } from "@/lib/api";
import { slugify } from "@/lib/utils";

interface PostFormProps {
  initial?: Post;
}

export function PostForm({ initial }: PostFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      slug: initial?.slug ?? "",
      title: initial?.title ?? "",
      excerpt: initial?.excerpt ?? "",
      body: initial?.body ?? "",
      coverImage: initial?.coverImage ?? "",
      tags: initial?.tags ?? [],
      status: initial?.status ?? "DRAFT",
      publishedAt: initial?.publishedAt ?? null,
    },
  });

  const onSubmit = async (data: PostInput) => {
    setSaving(true);
    setError("");
    try {
      if (isEdit && initial) {
        await api.patch(`/api/admin/posts/${initial.id}`, data);
      } else {
        await api.post("/api/admin/posts", data);
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial) return;
    if (!confirm(`Delete "${initial.title}"?`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/posts/${initial.id}`);
      router.push("/admin/posts");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };

  const slug = watch("slug");
  const title = watch("title");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
          <Field label="Excerpt" required error={errors.excerpt?.message}>
            <Textarea {...register("excerpt")} error={!!errors.excerpt} rows={3} />
          </Field>
          <Field label="Body" required error={errors.body?.message}>
            <Controller
              control={control}
              name="body"
              render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
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
            <Field label="Status" error={errors.status?.message}>
              <Select {...register("status")}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </Select>
            </Field>
            <Field label="Tags">
              <Controller
                control={control}
                name="tags"
                render={({ field }) => <ChipsInput value={field.value} onChange={field.onChange} placeholder="engineering, playbook…" />}
              />
            </Field>
          </div>
        </aside>
      </div>

      {error ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" /><span>{error}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
        {isEdit ? (
          <Button type="button" variant="ghost" onClick={onDelete} loading={deleting} className="text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        ) : <span />}
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push("/admin/posts")}>Cancel</Button>
          <Button type="submit" loading={saving}>
            <Save className="h-4 w-4" /> {isEdit ? "Save changes" : "Create post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
