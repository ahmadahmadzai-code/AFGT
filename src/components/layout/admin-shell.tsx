import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminShellProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminShell({ title, description, actions, children, className }: AdminShellProps) {
  return (
    <div className={cn("min-h-screen", className)}>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-6 border-b border-white/[0.06] bg-ink-950/80 px-8 py-5 backdrop-blur-xl">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-ink-200/70">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="px-8 py-8">{children}</div>
    </div>
  );
}
