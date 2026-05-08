import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-xl border bg-ink-900/60 px-4 text-sm text-white placeholder:text-ink-300/60",
        "transition-colors focus:outline-none focus:ring-2 focus:ring-mint/40",
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
Input.displayName = "Input";
