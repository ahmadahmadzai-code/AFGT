import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Width = "sm" | "md" | "lg" | "xl" | "full";

const widths: Record<Width, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: Width;
}

export function Container({ className, width = "xl", ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full px-6 lg:px-8", widths[width], className)}
      {...props}
    />
  );
}
