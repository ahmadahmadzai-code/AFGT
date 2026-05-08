import type { Metadata } from "next";
import { LoginForm } from "@/features/admin/login-form";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: { from?: string; error?: string };
}

export default function AdminLoginPage({ searchParams }: PageProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <Container width="sm">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-mint/10 ring-1 ring-mint/30">
              <span className="font-display text-sm font-bold text-mint">AF</span>
            </span>
            <div>
              <div className="font-display text-lg font-semibold text-white">
                AFG Tech
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-mint/80">
                CMS · admin sign-in
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-xl">
            <h1 className="font-display text-2xl font-semibold text-white">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-ink-200/75">
              Sign in to manage projects, posts, and inquiries.
            </p>

            <div className="mt-7">
              <LoginForm
                callbackUrl={searchParams.from ?? "/admin"}
                initialError={searchParams.error}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
