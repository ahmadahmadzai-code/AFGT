"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { contactSchema, type ContactInput } from "@/features/admin/schemas";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error ?? "Something went wrong.");
      }
      reset();
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-mint/30 bg-mint/[0.06] p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-mint" />
        <h3 className="mt-5 font-display text-2xl font-semibold text-white">
          Got it. We'll be in touch.
        </h3>
        <p className="mt-3 text-sm text-ink-100/85">
          A real person on our team will reply within one business day. If
          it's urgent, email{" "}
          <a href="mailto:hello@afgtech.com" className="text-mint underline">
            hello@afgtech.com
          </a>{" "}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" htmlFor="name" required error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            {...register("name")}
            error={!!errors.name}
            placeholder="Jane Rivera"
          />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            placeholder="jane@company.com"
          />
        </Field>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Company" htmlFor="company" error={errors.company?.message}>
          <Input
            id="company"
            autoComplete="organization"
            {...register("company")}
            error={!!errors.company}
            placeholder="Acme Inc."
          />
        </Field>
        <Field label="Project budget" htmlFor="budget" error={errors.budget?.message}>
          <Select id="budget" {...register("budget")}>
            <option value="">Choose a range</option>
            <option value="under-50k">Under $50k</option>
            <option value="50k-150k">$50k – $150k</option>
            <option value="150k-500k">$150k – $500k</option>
            <option value="500k+">$500k+</option>
            <option value="unsure">Not sure yet</option>
          </Select>
        </Field>
      </div>

      <Field
        label="What are you trying to ship?"
        htmlFor="message"
        required
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          rows={6}
          {...register("message")}
          error={!!errors.message}
          placeholder="Tell us the outcome, the deadline, and the constraint that's slowing you down."
        />
      </Field>

      {status === "error" ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <div>
        <Button type="submit" size="lg" loading={status === "submitting"}>
          Send message
        </Button>
        <p className="mt-3 text-xs text-ink-300/70">
          We reply within one business day. Real engineers, real answers.
        </p>
      </div>
    </form>
  );
}
