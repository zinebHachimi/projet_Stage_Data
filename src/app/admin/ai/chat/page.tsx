"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AdminCard } from "@/components/admin/AdminShell";
import {
  Send,
  Sparkles,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Check,
  Globe,
} from "lucide-react";

type JobCardType = {
  id: string;
  title: string;
  company: string;
  city: string;
  country: string;
  contract: string;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  source: string;
  sourceUrl: string | null;
  publishedAt: string | null;
  collectedAt: string;
};

type MessageMetadata = {
  intent?: string;
  entities?: any;
  jobs?: JobCardType[];
  metrics?: {
    responseTime: number;
    backendLatency?: number;
    resultCount: number;
    status: string;
  };
};

type Message = {
  id: string;
  role: string;
  content: string;
  metadata?: any;
  createdAt: string;
};

const QUICK_CHIPS = [
  "Stage en développement Web à Casablanca",
  "Offres d'emploi React en Télétravail",
  "Python junior jobs",
  "Marketing internship in Rabat",
];

export default function AdminChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  
  // Local state for interactive features
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);
  const [expandedJobIds, setExpandedJobIds] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages
  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chat", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to load chat");
      } else {
        setMessages(data);
      }
    } catch {
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  }

  // Load bookmarks from local storage
  useEffect(() => {
    const saved = localStorage.getItem("job_bookmarks");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch {}
    }
    void load();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // Handle message sending
  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;
    setError("");
    setSending(true);
    setContent("");

    // Optimistic user message insertion
    const tempUserMsg: Message = {
      id: `temp-user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((current) => [...current, tempUserMsg]);

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Message failed to send");
        // Remove the optimistic message on error
        setMessages((current) => current.filter((m) => m.id !== tempUserMsg.id));
      } else {
        // Replace optimistic message and append assistant message
        setMessages((current) => [
          ...current.filter((m) => m.id !== tempUserMsg.id),
          data.userMessage,
          data.assistantMessage,
        ]);
      }
    } catch {
      setError("Server connection failed");
      setMessages((current) => current.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sendMessage(content);
  }

  // Bookmarking handler
  function toggleBookmark(jobId: string) {
    let next: string[];
    if (bookmarks.includes(jobId)) {
      next = bookmarks.filter((id) => id !== jobId);
    } else {
      next = [...bookmarks, jobId];
    }
    setBookmarks(next);
    localStorage.setItem("job_bookmarks", JSON.stringify(next));
  }

  // Sharing handler
  function handleShare(job: JobCardType) {
    const url = job.sourceUrl || window.location.href;
    void navigator.clipboard.writeText(url);
    setCopiedJobId(job.id);
    setTimeout(() => setCopiedJobId(null), 2000);
  }

  // Expand card handler
  function toggleDetails(jobId: string) {
    if (expandedJobIds.includes(jobId)) {
      setExpandedJobIds(expandedJobIds.filter((id) => id !== jobId));
    } else {
      setExpandedJobIds([...expandedJobIds, jobId]);
    }
  }

  // Parse JSON metadata safely
  function getMetadata(msg: Message): MessageMetadata | null {
    if (!msg.metadata) return null;
    if (typeof msg.metadata === "string") {
      try {
        return JSON.parse(msg.metadata) as MessageMetadata;
      } catch {
        return null;
      }
    }
    return msg.metadata as MessageMetadata;
  }

  // Custom regex-based markdown formatter for bolds and backticks
  function formatMarkdown(text: string) {
    if (!text) return "";
    
    // Split by markdown bold tags **text**
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-slate-800">
            {part.slice(2, -2)}
          </strong>
        );
      }
      
      // Inline backticks code formatting `code`
      const subParts = part.split(/(`[^`]+`)/g);
      return subParts.map((sub, subIndex) => {
        if (sub.startsWith("`") && sub.endsWith("`")) {
          return (
            <code
              key={subIndex}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-cyan-700"
            >
              {sub.slice(1, -1)}
            </code>
          );
        }
        return sub;
      });
    });
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
      <AdminCard className="col-span-12 flex flex-col h-full overflow-hidden">
        {/* Header bar */}
        <div className="mb-4 flex items-center justify-between border-b border-[#dfe5ef] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecf2ff] text-[#5d87ff]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">AI recruitment assistant</h2>
              <p className="text-xs text-[#5a6a85bf]">
                Ask for jobs or internships in natural language. Powered by Gemini.
              </p>
            </div>
          </div>
          <button
            onClick={() => void load()}
            className="text-xs font-semibold text-[#5d87ff] hover:underline"
          >
            Reload Chat
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500 border border-red-100 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="font-bold hover:opacity-80">
              ✕
            </button>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto rounded-xl bg-slate-50 border border-[#dfe5ef] p-6 space-y-6">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#5d87ff] border-r-transparent align-[-0.125em]" />
                <p className="mt-2 text-xs font-semibold text-[#5a6a85bf]">Loading messages...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6">
              <Briefcase size={40} className="text-[#5a6a85bf] mb-3 opacity-60" />
              <p className="text-sm font-semibold text-slate-700">Aucune conversation en cours.</p>
              <p className="text-xs text-[#5a6a85bf] max-w-xs mt-1">
                Choisissez un sujet rapide ci-dessous ou saisissez votre demande pour démarrer.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const isUser = message.role === "user";
                const meta = getMetadata(message);
                const showJobs = meta?.jobs && meta.jobs.length > 0;

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    {/* Message bubble */}
                    <div className="flex items-start gap-2 max-w-[85%]">
                      {!isUser && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#5d87ff] to-cyan-400 text-white font-bold text-xs shadow-sm">
                          AJ
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-5 py-3.5 text-sm shadow-[0_1px_2px_rgba(0,0,0,0.05)] whitespace-pre-wrap leading-relaxed ${
                          isUser
                            ? "bg-gradient-to-r from-[#5d87ff] to-[#4b73df] text-white rounded-tr-none"
                            : "bg-white text-slate-800 border border-[#dfe5ef] rounded-tl-none"
                        }`}
                      >
                        {isUser ? message.content : formatMarkdown(message.content)}

                        {/* Search metrics details */}
                        {!isUser && meta?.metrics && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#5a6a85bf] font-medium">
                            <span>⏱️ AI response: {meta.metrics.responseTime}ms</span>
                            {meta.metrics.backendLatency && (
                              <span>🔌 API Latency: {meta.metrics.backendLatency}ms</span>
                            )}
                            <span>🔍 Found {meta.metrics.resultCount} jobs</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job Cards Layout */}
                    {!isUser && showJobs && meta?.jobs && (
                      <div className="mt-4 pl-10 w-100 grid grid-cols-12 gap-4 max-w-[95%]">
                        {meta.jobs.map((job) => {
                          const isBookmarked = bookmarks.includes(job.id);
                          const isExpanded = expandedJobIds.includes(job.id);
                          const formattedSalary =
                            job.salaryMin || job.salaryMax
                              ? `${job.salaryMin ? `${job.salaryMin}` : "—"} - ${
                                  job.salaryMax ? `${job.salaryMax}` : "—"
                                } ${job.salaryCurrency}`
                              : null;

                          return (
                            <div
                              key={job.id}
                              className="col-span-12 md:col-span-6 rounded-xl border border-[#dfe5ef] bg-white p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                              <div>
                                {/* Header (Title, Bookmark) */}
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-800 hover:text-[#5d87ff] transition">
                                      {job.title}
                                    </h4>
                                    <span className="text-xs font-semibold text-[#5a6a85bf] block mt-0.5">
                                      {job.company}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => toggleBookmark(job.id)}
                                    className={`shrink-0 rounded-lg p-1.5 border transition ${
                                      isBookmarked
                                        ? "bg-yellow-50 border-yellow-200 text-yellow-500"
                                        : "border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    }`}
                                    title={isBookmarked ? "Remove Bookmark" : "Bookmark Job"}
                                  >
                                    <Bookmark size={15} fill={isBookmarked ? "currentColor" : "none"} />
                                  </button>
                                </div>

                                {/* Badges */}
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  <span className="inline-flex items-center gap-1 rounded bg-[#ecf2ff] px-2 py-0.5 text-[10px] font-bold text-[#5d87ff] uppercase">
                                    {job.contract.replace("_", " ")}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                    <MapPin size={10} />
                                    {job.city}
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-bold text-cyan-700">
                                    <Globe size={10} />
                                    {job.source}
                                  </span>
                                </div>

                                {/* Skills */}
                                {job.skills.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-1">
                                    {job.skills.slice(0, 4).map((skill) => (
                                      <span
                                        key={skill}
                                        className="rounded bg-slate-50 border border-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 font-medium"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {job.skills.length > 4 && (
                                      <span className="text-[10px] text-[#5a6a85bf] font-medium self-center pl-1">
                                        +{job.skills.length - 4} more
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Expansion toggle details */}
                                {isExpanded && (
                                  <div className="mt-3 pt-3 border-t border-dashed border-slate-100 text-xs text-slate-600 space-y-2 animate-fade-in">
                                    {formattedSalary && (
                                      <div className="flex items-center gap-1.5">
                                        <DollarSign size={13} className="text-emerald-500" />
                                        <span>
                                          <strong>Estimated Salary:</strong> {formattedSalary}
                                        </span>
                                      </div>
                                    )}
                                    {job.publishedAt && (
                                      <div className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-[#5d87ff]" />
                                        <span>
                                          <strong>Posted Date:</strong>{" "}
                                          {new Date(job.publishedAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="text-[11px] text-[#5a6a85bf]">
                                      <strong>Source Engine:</strong> Collected via {job.source}{" "}
                                      crawler on {new Date(job.collectedAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Footer Action Buttons */}
                              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                <button
                                  onClick={() => toggleDetails(job.id)}
                                  className="flex items-center gap-1 text-xs font-semibold text-[#5a6a85bf] hover:text-slate-800 transition"
                                >
                                  {isExpanded ? (
                                    <>
                                      Hide Details <ChevronUp size={14} />
                                    </>
                                  ) : (
                                    <>
                                      View Details <ChevronDown size={14} />
                                    </>
                                  )}
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleShare(job)}
                                    className="rounded-lg p-1.5 border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
                                    title="Copy Job Link"
                                  >
                                    {copiedJobId === job.id ? (
                                      <Check size={14} className="text-emerald-500" />
                                    ) : (
                                      <Share2 size={14} />
                                    )}
                                  </button>
                                  {job.sourceUrl && (
                                    <a
                                      href={job.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 rounded-lg bg-[#5d87ff] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#4b73df] transition"
                                    >
                                      Apply <ExternalLink size={12} />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing Loader animation */}
              {sending && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-[#5d87ff] to-cyan-400 text-white font-bold text-xs shadow-sm">
                    AJ
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white text-slate-800 border border-[#dfe5ef] px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Preset quick-chips helper */}
        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setContent(chip);
                sendMessage(chip);
              }}
              disabled={sending}
              className="rounded-full bg-white border border-[#dfe5ef] px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-[#5d87ff] hover:text-[#5d87ff] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={submit} className="mt-3 flex gap-3">
          <input
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={sending}
            className="min-h-12 flex-1 rounded-xl border border-[#dfe5ef] px-4 text-sm outline-none focus:border-[#5d87ff] bg-white transition disabled:bg-slate-50 disabled:cursor-not-allowed"
            placeholder="Ask about job offers, remote work, internships, or salaries..."
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5d87ff] text-white shadow-sm transition hover:bg-[#4b73df] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </AdminCard>
    </div>
  );
}
