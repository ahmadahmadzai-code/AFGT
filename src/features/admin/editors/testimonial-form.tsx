"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2, AlertCircle } from "lucide-react";
import type { Testimonial } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { testimonialSchema, type TestimonialInput } from "@/features/admin/schemas";
import { api } from "@/lib/api";

interface TestimonialFormProps {
  initial?: Testimonial;
  onClose: () => void;
}

export function TestimonialForm({ initial, onClose }: TestimonialFormProps) {
  const router = useRouter();
  const isEdit = !!initial;
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      quote: initial?.quote ?? "",
      author: initial?.author ?? "",
      role: initial?.role ?? "",
      company: initial?.company ?? "",
      avatar: initial?.avatar ?? "",
      rating: initial?.rating ?? 5,
      featured: initial?.featured ?? false,
      order: initial?.order ?? 0,
    },
  });

  const onSubmit = async (data: TestimonialInput) => {
    setSaving(true);
    setError("");
    try {
      if (isEdit && initial) {
        await api.patch(`/api/admin/testimonials/${initial.id}`, data);
      } else {
        await api.post("/api/admin/testimonials", data);
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
    if (!confirm("Delete this testimonial?")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/admin/testimonials/${initial.id}`);
      router.refresh();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Quote" required error={errors.quote?.message}>
        <Textarea {...register("quote")} error={!!errors.quote} rows={4} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Author" required error={errors.author?.message}>
          <Input {...register("author")} error={!!errors.author} />
        </Field>
        <Field label="Role" required error={errors.role?.message}>
          <Input {...register("role")} error={!!errors.role} />
        </Field>
        <Field label="Company" required error={errors.company?.message}>
          <Input {...register("company")} error={!!errors.company} />
        </Field>
        <Field label="Avatar URL" error={errors.avatar?.message}>
          <Input type="url" {...register("avatar")} error={!!errors.avatar} placeholder="https://…" />
        </Field>
        <Field label="Rating (1–5)" error={errors.rating?.message}>
          <Input type="number" min={1} max={5} {...register("rating")} error={!!errors.rating} />
        </Field>
        <Field label="Order" error={errors.order?.message}>
          <Input type="number" {...register("order")} error={!!errors.order} />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm text-ink-100">
        <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded border-white/20 bg-ink-900 text-mint focus:ring-mint" />
        Featured on homepage
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
