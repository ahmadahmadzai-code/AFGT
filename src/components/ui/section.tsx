import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Pad = "sm" | "md" | "lg";

const pads: Record<Pad, string> = {
  sm: "py-12 md:py-16",
  md: "py-20 md:py-28",
  lg: "py-28 md:py-40",
};

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  pad?: Pad;
}

export function Section({ className, pad = "md", ...props }: SectionProps) {
  return <section className={cn("relative", pads[pad], className)} {...props} />;
}

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-mint/30 bg-mint/[0.08] px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-mint",
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-[0_0_8px_#00E5A0]" />
      {children}
    </div>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Eyebrow className="mb-5">{eyebrow}</Eyebrow> : null}
      <h2 className="font-display text-display-md text-balance glow-text">{title}</h2>
      {description ? (
        <p className="mt-4 text-pretty text-base text-ink-200/80 md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
