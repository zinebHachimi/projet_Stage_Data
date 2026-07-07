"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminCard, EmptyState } from "@/components/admin/AdminShell";

type ErrorLog = { id: string; statusCode: number; title: string; message: string; severity: string; path?: string | null; resolvedAt?: string | null; createdAt: string };

export default function AdminErrorsPage() {
  const [logs, setLogs] = useState<ErrorLog[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/admin/errors", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Unable to load errors");
    else setLogs(data);
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Unable to create error log");
    event.currentTarget.reset();
    setLogs((current) => [data, ...current]);
  }

  async function resolve(id: string) {
    const res = await fetch(`/api/admin/errors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resolved: true }),
    });
    const data = await res.json();
    if (res.ok) setLogs((current) => current.map((item) => item.id === id ? data : item));
  }

  async function remove(id: string) {
    await fetch(`/api/admin/errors/${id}`, { method: "DELETE" });
    setLogs((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <AdminCard className="col-span-12 lg:col-span-4">
        <h2 className="mb-5 text-xl font-semibold">Error Pages</h2>
        {error && <p className="mb-4 rounded-md bg-[#fee2e2] p-3 text-sm text-[#ef4444]">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input name="statusCode" required type="number" placeholder="Status code" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <input name="title" required placeholder="Title" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <input name="path" placeholder="Path" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <select name="severity" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3">
            <option>INFO</option><option>WARNING</option><option>ERROR</option><option>CRITICAL</option>
          </select>
          <textarea name="message" required placeholder="Message" className="min-h-28 w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <button className="w-full rounded-md bg-[#5d87ff] py-3 font-semibold text-white">Create Error</button>
        </form>
      </AdminCard>
      <AdminCard className="col-span-12 lg:col-span-8">
        <h3 className="mb-5 text-lg font-semibold">Error Logs</h3>
        {logs.length === 0 ? <EmptyState title="No error logs recorded." /> : (
          <div className="space-y-4">
            {logs.map((log) => (
              <article key={log.id} className="rounded-md border border-[#dfe5ef] p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-[#fee2e2] px-2 py-1 text-xs font-bold text-[#ef4444]">{log.statusCode}</span>
                      <h4 className="font-semibold">{log.title}</h4>
                      {log.resolvedAt && <span className="rounded-md bg-[#dcfce7] px-2 py-1 text-xs font-bold text-[#15803d]">RESOLVED</span>}
                    </div>
                    <p className="mt-2 text-sm text-[#5a6a85bf]">{log.message}</p>
                    <p className="mt-2 text-xs text-[#5a6a85bf]">{log.path || "No path"} - {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-3">
                    {!log.resolvedAt && <button onClick={() => void resolve(log.id)} className="text-sm font-semibold text-[#13deb9]">Resolve</button>}
                    <button onClick={() => void remove(log.id)} className="text-sm font-semibold text-[#ef4444]">Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
