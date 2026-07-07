"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { AdminCard, EmptyState } from "@/components/admin/AdminShell";

type Card = { id: string; title: string; description?: string | null; priority: "LOW" | "MEDIUM" | "HIGH"; imageUrl?: string | null; dueDate?: string | null };
type Column = { id: string; title: string; cards: Card[] };

export default function AdminKanbanPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/kanban", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Unable to load board");
    else setColumns(data);
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/kanban/cards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Unable to create card");
    event.currentTarget.reset();
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/admin/kanban/cards/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <AdminCard>
        <h2 className="mb-5 text-xl font-semibold">Kanban</h2>
        {error && <p className="mb-4 rounded-md bg-[#fee2e2] p-3 text-sm text-[#ef4444]">{error}</p>}
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-5">
          <select name="columnId" required className="rounded-md border border-[#dfe5ef] px-4 py-3">
            <option value="">Column</option>
            {columns.map((column) => <option key={column.id} value={column.id}>{column.title}</option>)}
          </select>
          <input name="title" required placeholder="Task title" className="rounded-md border border-[#dfe5ef] px-4 py-3" />
          <select name="priority" className="rounded-md border border-[#dfe5ef] px-4 py-3">
            <option>LOW</option>
            <option>MEDIUM</option>
            <option>HIGH</option>
          </select>
          <input name="dueDate" type="date" className="rounded-md border border-[#dfe5ef] px-4 py-3" />
          <button className="rounded-md bg-[#5d87ff] px-5 py-3 font-semibold text-white">Add Card</button>
          <textarea name="description" placeholder="Description" className="rounded-md border border-[#dfe5ef] px-4 py-3 md:col-span-5" />
        </form>
      </AdminCard>

      <div className="grid gap-6 xl:grid-cols-4">
        {columns.length === 0 ? <EmptyState title="Loading board..." /> : columns.map((column) => (
          <AdminCard key={column.id}>
            <h3 className="mb-4 text-lg font-semibold">{column.title}</h3>
            <div className="space-y-4">
              {column.cards.length === 0 ? <EmptyState title="No cards." /> : column.cards.map((card) => (
                <article key={card.id} className="rounded-md border border-[#dfe5ef] bg-[#f8fafc] p-4">
                  {card.imageUrl && <Image src={card.imageUrl} width={320} height={160} alt="" className="mb-3 rounded-md object-cover" />}
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold">{card.title}</h4>
                    <button onClick={() => void remove(card.id)} className="text-sm text-[#ef4444]">Delete</button>
                  </div>
                  {card.description && <p className="mt-2 text-sm text-[#5a6a85bf]">{card.description}</p>}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-[#ecf2ff] px-3 py-1 font-semibold text-[#5d87ff]">{card.priority}</span>
                    {card.dueDate && <span className="text-[#5a6a85bf]">{new Date(card.dueDate).toLocaleDateString()}</span>}
                  </div>
                </article>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
