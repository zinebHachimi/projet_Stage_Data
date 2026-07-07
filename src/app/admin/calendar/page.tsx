"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminCard, EmptyState } from "@/components/admin/AdminShell";

type EventItem = { id: string; title: string; description?: string | null; startsAt: string; endsAt: string; location?: string | null };

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/calendar", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Unable to load events");
    else setEvents(data);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Unable to save event");
    event.currentTarget.reset();
    setEvents((current) => [...current, data].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
  }

  async function remove(id: string) {
    await fetch(`/api/admin/calendar/${id}`, { method: "DELETE" });
    setEvents((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <AdminCard className="col-span-12 lg:col-span-4">
        <h2 className="mb-5 text-xl font-semibold">Calendar</h2>
        {error && <p className="mb-4 rounded-md bg-[#fee2e2] p-3 text-sm text-[#ef4444]">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <input name="title" required placeholder="Title" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <input name="location" placeholder="Location" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <textarea name="description" placeholder="Description" className="min-h-28 w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <input name="startsAt" required type="datetime-local" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <input name="endsAt" required type="datetime-local" className="w-full rounded-md border border-[#dfe5ef] px-4 py-3" />
          <button className="w-full rounded-md bg-[#5d87ff] py-3 font-semibold text-white">Create Event</button>
        </form>
      </AdminCard>
      <AdminCard className="col-span-12 lg:col-span-8">
        <h3 className="mb-5 text-lg font-semibold">Upcoming Events</h3>
        {loading ? <EmptyState title="Loading events..." /> : events.length === 0 ? <EmptyState title="No calendar events yet." /> : (
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((item) => (
              <article key={item.id} className="rounded-md border border-[#dfe5ef] p-4">
                <div className="flex justify-between gap-3">
                  <h4 className="font-semibold">{item.title}</h4>
                  <button onClick={() => void remove(item.id)} className="text-sm text-[#ef4444]">Delete</button>
                </div>
                <p className="mt-2 text-sm text-[#5a6a85bf]">{new Date(item.startsAt).toLocaleString()} - {new Date(item.endsAt).toLocaleString()}</p>
                {item.location && <p className="mt-2 text-sm">{item.location}</p>}
                {item.description && <p className="mt-2 text-sm text-[#5a6a85bf]">{item.description}</p>}
              </article>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
