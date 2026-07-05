import Link from "next/link";
import type { ReactNode } from "react";
import { Activity } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
}: AuthPageShellProps) {
  return (
    <main className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,#155e75_0,#07131f_36%,#05070d_74%)] px-5 py-8 text-white">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_0.7fr] lg:items-center">
        <section>
          <Link href="/" className="mb-12 inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full bg-white text-slate-950">
              <Activity size={20} />
            </span>
            <span className="text-sm font-semibold">Agentic Data Gathering</span>
          </Link>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-cyan-100">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-tight">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">{description}</p>
        </section>
        <GlassCard className="p-5 sm:p-7" intensity="strong">
          {children}
        </GlassCard>
      </div>
    </main>
  );
}
