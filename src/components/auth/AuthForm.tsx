"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthMode } from "@/types/api";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthErrorResponse = {
  error?: {
    message?: string;
  };
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      action: mode,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json()) as AuthErrorResponse;
        setError(data.error?.message ?? "Authentication failed.");
        return;
      }

      router.push("/");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {mode === "register" ? (
        <label className="grid gap-2 text-sm text-white/70">
          Full name
          <input
            name="name"
            required
            className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/45 px-4 text-white outline-none transition focus:border-cyan-200/60"
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm text-white/70">
        Email
        <input
          name="email"
          type="email"
          required
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/45 px-4 text-white outline-none transition focus:border-cyan-200/60"
        />
      </label>

      <label className="grid gap-2 text-sm text-white/70">
        Password
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="min-h-12 rounded-2xl border border-white/10 bg-slate-950/45 px-4 text-white outline-none transition focus:border-cyan-200/60"
        />
      </label>

      {error ? (
        <p className="rounded-2xl border border-rose-200/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 min-h-12 rounded-2xl bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Working" : mode === "login" ? "Login" : "Create workspace"}
      </button>
    </form>
  );
}
