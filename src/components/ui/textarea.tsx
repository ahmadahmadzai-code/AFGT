import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, rows = 5, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-white placeholder:text-ink-300/60",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-mint/40 resize-y",
        error
          ? "border-red-500/60 focus:border-red-500"
          : "border-white/10 focus:border-mint/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
