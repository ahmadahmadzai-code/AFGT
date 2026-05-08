"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof schema>;

interface LoginFormProps {
  callbackUrl: string;
  initialError?: string;
}

export function LoginForm({ callbackUrl, initialError }: LoginFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    initialError ? "Sign-in failed. Please try again." : "",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setErrorMsg("");
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: true,
      redirectTo: callbackUrl,
    });
    if (res && "error" in res && res.error) {
      setErrorMsg("Email or password is incorrect.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <Field label="Email" htmlFor="email" required error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          error={!!errors.email}
        />
      </Field>
      <Field
        label="Password"
        htmlFor="password"
        required
        error={errors.password?.message}
      >
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
          error={!!errors.password}
        />
      </Field>

      {errorMsg ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{errorMsg}</span>
        </div>
      ) : null}

      <Button type="submit" size="lg" loading={submitting} fullWidth>
        Sign in
      </Button>
    </form>
  );
}
