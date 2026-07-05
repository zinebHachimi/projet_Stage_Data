import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  intensity?: "soft" | "strong";
};

export function GlassCard({ className, intensity = "soft", ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-[24px] border shadow-2xl shadow-slate-950/20 backdrop-blur-2xl",
        intensity === "strong"
          ? "border-white/15 bg-white/12"
          : "border-white/10 bg-white/8",
        className,
      )}
      {...props}
    />
  );
}
