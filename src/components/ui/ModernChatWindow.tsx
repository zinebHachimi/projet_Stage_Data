"use client";

import { FormEvent, useState } from "react";
import { SendHorizonal, Sparkles } from "lucide-react";
import { GlassCard } from "./GlassCard";

type ChatResponse = {
  reply: string;
  parsedIntent: {
    role: string;
    country: string;
  };
};

export function ModernChatWindow() {
  const [prompt, setPrompt] = useState("Je veux toutes les offres de Data Scientist au Maroc");
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);

    try {
      const result = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = (await result.json()) as ChatResponse;
      setResponse(data);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <GlassCard className="p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-cyan-200 text-slate-950">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold">Commande en langage naturel</p>
          <p className="text-xs text-white/45">Interaction client sécurisée</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-slate-950/45 px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-200/60"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-200 px-5 text-sm font-semibold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizonal size={16} />
          {isPending ? "Analyse..." : "Demander"}
        </button>
      </form>

      {response ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-white/70">
          <p>{response.reply}</p>
          <p className="mt-3 text-xs text-cyan-100">
            Intention : {response.parsedIntent.role} en/au {response.parsedIntent.country}
          </p>
        </div>
      ) : null}
    </GlassCard>
  );
}
