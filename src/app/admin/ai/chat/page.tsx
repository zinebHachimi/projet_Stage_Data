"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminCard, EmptyState } from "@/components/admin/AdminShell";

type Message = { id: string; role: string; content: string; createdAt: string };

export default function AdminChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/chat", { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) setError(data.error ?? "Unable to load chat");
    else setMessages(data);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const res = await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error ?? "Message failed");
    setMessages((current) => [...current, data.userMessage, data.assistantMessage]);
    setContent("");
  }

  return (
    <AdminCard>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">AI Chat</h2>
          <p className="text-sm text-[#5a6a85bf]">Messages are saved in MongoDB and parsed by the existing intent service.</p>
        </div>
      </div>
      {error && <p className="mb-4 rounded-md bg-[#fee2e2] p-3 text-sm text-[#ef4444]">{error}</p>}
      <div className="mb-6 h-[520px] overflow-y-auto rounded-md border border-[#dfe5ef] bg-[#f8fafc] p-5">
        {loading ? <EmptyState title="Loading chat..." /> : messages.length === 0 ? <EmptyState title="No chat messages yet." /> : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[760px] rounded-md px-4 py-3 text-sm ${message.role === "user" ? "bg-[#5d87ff] text-white" : "bg-white text-[#1c2536] shadow-sm"}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={submit} className="flex gap-3">
        <input value={content} onChange={(event) => setContent(event.target.value)} className="min-h-11 flex-1 rounded-md border border-[#dfe5ef] px-4 outline-none focus:border-[#5d87ff]" placeholder="Ask about job offers, gathering, or analytics" />
        <button disabled={!content.trim()} className="rounded-md bg-[#5d87ff] px-5 font-semibold text-white disabled:opacity-50">Send</button>
      </form>
    </AdminCard>
  );
}
