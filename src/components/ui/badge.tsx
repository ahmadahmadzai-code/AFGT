import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "mint" | "neutral" | "warning" | "danger";

const tones: Record<Tone, string> = {
  mint: "bg-mint/10 text-mint border-mint/30",
  neutral: "bg-white/5 text-ink-200 border-white/10",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  danger: "bg-red-500/10 text-red-300 border-red-500/30",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "mint", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
