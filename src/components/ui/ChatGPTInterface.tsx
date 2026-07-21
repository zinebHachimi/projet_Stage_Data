"use client";

import React, { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
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
  Plus,
  Search,
  Trash2,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Menu,
  Pin,
  Paperclip,
  Copy,
  RotateCw,
  X,
  Briefcase,
  FileText,
  User,
  Bot,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

// Type Definitions
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
  entities?: unknown;
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
  metadata?: unknown;
  createdAt: string;
};

type Conversation = {
  id: string;
  title: string;
  pinned: boolean;
  createdAt: string;
  messageIds: string[];
};

const QUICK_CHIPS = [
  "Stage en développement Web à Casablanca",
  "Offres d'emploi React en Télétravail",
  "Python junior jobs à Rabat",
  "Stage PFE Data Science & AI",
];

// Helper Component: Markdown Code Block with Copy
function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden text-xs font-mono shadow-sm">
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700/60 select-none">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition px-2 py-0.5 rounded hover:bg-slate-700/60"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copié</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-slate-100 leading-relaxed font-mono">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

// Inline Markdown Parser
function parseInlineElements(text: string): React.ReactNode[] {
  let parts: Array<{ type: "text" | "bold" | "italic" | "code" | "link"; text: string; url?: string }> = [
    { type: "text", text },
  ];

  parts = parts.flatMap((p) => {
    if (p.type !== "text") return p;
    const items: typeof parts = [];
    let rem = p.text;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/;
    let m;
    while ((m = rem.match(regex))) {
      const idx = m.index!;
      if (idx > 0) items.push({ type: "text", text: rem.substring(0, idx) });
      items.push({ type: "link", text: m[1], url: m[2] });
      rem = rem.substring(idx + m[0].length);
    }
    if (rem.length > 0) items.push({ type: "text", text: rem });
    return items;
  });

  parts = parts.flatMap((p) => {
    if (p.type !== "text") return p;
    const items: typeof parts = [];
    let rem = p.text;
    const regex = /\*\*([^*]+)\*\*/;
    let m;
    while ((m = rem.match(regex))) {
      const idx = m.index!;
      if (idx > 0) items.push({ type: "text", text: rem.substring(0, idx) });
      items.push({ type: "bold", text: m[1] });
      rem = rem.substring(idx + m[0].length);
    }
    if (rem.length > 0) items.push({ type: "text", text: rem });
    return items;
  });

  parts = parts.flatMap((p) => {
    if (p.type !== "text") return p;
    const items: typeof parts = [];
    let rem = p.text;
    const regex = /`([^`]+)`/;
    let m;
    while ((m = rem.match(regex))) {
      const idx = m.index!;
      if (idx > 0) items.push({ type: "text", text: rem.substring(0, idx) });
      items.push({ type: "code", text: m[1] });
      rem = rem.substring(idx + m[0].length);
    }
    if (rem.length > 0) items.push({ type: "text", text: rem });
    return items;
  });

  parts = parts.flatMap((p) => {
    if (p.type !== "text") return p;
    const items: typeof parts = [];
    let rem = p.text;
    const regex = /\*([^*]+)\*/;
    let m;
    while ((m = rem.match(regex))) {
      const idx = m.index!;
      if (idx > 0) items.push({ type: "text", text: rem.substring(0, idx) });
      items.push({ type: "italic", text: m[1] });
      rem = rem.substring(idx + m[0].length);
    }
    if (rem.length > 0) items.push({ type: "text", text: rem });
    return items;
  });

  return parts.map((p, i) => {
    switch (p.type) {
      case "bold":
        return <strong key={i} className="font-bold text-slate-900">{p.text}</strong>;
      case "italic":
        return <em key={i} className="italic text-slate-800">{p.text}</em>;
      case "code":
        return (
          <code key={i} className="rounded bg-slate-100 border border-slate-200/80 px-1.5 py-0.5 text-xs font-mono text-blue-700">
            {p.text}
          </code>
        );
      case "link":
        return (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline font-semibold inline-flex items-center gap-0.5"
          >
            {p.text}
            <ExternalLink size={10} className="inline" />
          </a>
        );
      default:
        return p.text;
    }
  });
}

function renderMarkdown(contentStr: string) {
  if (!contentStr) return null;

  const blocks = contentStr.split(/(```[\s\S]*?```)/g);

  return blocks.map((block, idx) => {
    if (block.startsWith("```") && block.endsWith("```")) {
      const match = block.match(/```(\w*)\n([\s\S]*?)```/);
      const lang = match ? match[1] : "";
      const code = match ? match[2] : block.slice(3, -3);
      return <CodeBlock key={idx} code={code} lang={lang} />;
    }

    const lines = block.split("\n");
    let inList = false;
    let listItems: string[] = [];
    const nodes: React.ReactNode[] = [];

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        nodes.push(
          <ul key={key} className="list-disc pl-5 my-2 space-y-1.5 text-slate-700">
            {listItems.map((item, i) => (
              <li key={i} className="text-slate-700 leading-relaxed text-sm">
                {parseInlineElements(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) {
        flushList(`list-before-${idx}-${lineIdx}`);
        nodes.push(
          <h3 key={`h3-${idx}-${lineIdx}`} className="text-base font-bold text-slate-900 mt-4 mb-2">
            {parseInlineElements(trimmed.replace(/^###\s+/, ""))}
          </h3>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList(`list-before-${idx}-${lineIdx}`);
        nodes.push(
          <h2 key={`h2-${idx}-${lineIdx}`} className="text-lg font-bold text-slate-900 mt-5 mb-2">
            {parseInlineElements(trimmed.replace(/^##\s+/, ""))}
          </h2>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList) {
          flushList(`list-before-${idx}-${lineIdx}`);
          inList = true;
        }
        listItems.push(trimmed.slice(2));
      } else if (/^\d+\.\s/.test(trimmed)) {
        flushList(`list-before-${idx}-${lineIdx}`);
        const matchNum = trimmed.match(/^\d+\.\s/)?.[0] || "";
        nodes.push(
          <div key={`num-${idx}-${lineIdx}`} className="pl-2 my-1.5 flex gap-2 text-sm">
            <span className="font-semibold text-blue-600 shrink-0">{matchNum}</span>
            <div className="text-slate-700 leading-relaxed">
              {parseInlineElements(trimmed.replace(/^\d+\.\s/, ""))}
            </div>
          </div>
        );
      } else {
        flushList(`list-before-${idx}-${lineIdx}`);
        if (trimmed === "") {
          nodes.push(<div key={`br-${idx}-${lineIdx}`} className="h-2" />);
        } else {
          nodes.push(
            <p key={`p-${idx}-${lineIdx}`} className="my-1.5 text-slate-700 leading-relaxed text-sm">
              {parseInlineElements(line)}
            </p>
          );
        }
      }
    });

    flushList(`list-end-${idx}`);
    return <div key={`block-${idx}`}>{nodes}</div>;
  });
}

export function ChatGPTInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Interactive Features State
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);
  const [expandedJobIds, setExpandedJobIds] = useState<string[]>([]);

  // Conversation History State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("new-chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Message Interaction State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [likedMessages, setLikedMessages] = useState<Record<string, "like" | "dislike">>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ name?: string | null; email: string; role: string } | null>(null);

  // Auto-scroll logic ref
  const messageLogRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);
  const userScrolledUpRef = useRef<boolean>(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const isProgrammaticScrollRef = useRef<boolean>(false);

  // Check if scroll position is near bottom
  const checkIfNearBottom = useCallback(() => {
    const el = messageLogRef.current;
    if (!el) return true;
    const threshold = 150; // 150px tolerance window
    const position = el.scrollHeight - el.scrollTop - el.clientHeight;
    return position <= threshold;
  }, []);

  const handleScroll = () => {
    const el = messageLogRef.current;
    if (!el) return;

    if (isProgrammaticScrollRef.current) {
      return;
    }

    const isNearBottom = checkIfNearBottom();
    userScrolledUpRef.current = !isNearBottom;
    setShowScrollBottomBtn(!isNearBottom);
  };

  const scrollToBottom = useCallback((force = false) => {
    const el = messageLogRef.current;
    if (!el) return;

    if (force || !userScrolledUpRef.current) {
      isProgrammaticScrollRef.current = true;
      el.scrollTop = el.scrollHeight;
      userScrolledUpRef.current = false;
      setShowScrollBottomBtn(false);

      // Reset programmatic flag after a brief frame
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 50);
    }
  }, []);


  // Load chat messages and conversations
  async function load() {
    setLoading(true);
    setError("");
    try {
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      if (userRes.ok && userData.user) {
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/admin/chat", { cache: "no-store" });
      const data: Message[] = await res.json();
      if (!res.ok) {
        setError("Impossible de charger l'historique de chat");
      } else {
        setMessages(data);

        // Load conversation history from local storage
        const savedConvs = localStorage.getItem("ai_chat_conversations");
        let convList: Conversation[] = [];
        if (savedConvs) {
          try {
            convList = JSON.parse(savedConvs);
          } catch {}
        }

        if (convList.length === 0 && data.length > 0) {
          const messageIds = data.map((m) => m.id);
          const defaultConv: Conversation = {
            id: "default-conv",
            title: "Historique de conversation",
            pinned: false,
            createdAt: data[0]?.createdAt || new Date().toISOString(),
            messageIds,
          };
          convList = [defaultConv];
          setActiveConversationId("default-conv");
        } else if (convList.length > 0) {
          const allCategorizedIds = new Set(convList.flatMap((c) => c.messageIds));
          const orphans = data.filter((m) => !allCategorizedIds.has(m.id));
          if (orphans.length > 0) {
            const targetConv = convList[0];
            if (targetConv) {
              targetConv.messageIds = [...targetConv.messageIds, ...orphans.map((m) => m.id)];
            }
          }
          const active = convList.find((c) => c.pinned) || convList[0];
          if (active) {
            setActiveConversationId(active.id);
          }
        } else {
          setActiveConversationId("new-chat");
        }

        setConversations(convList);
        localStorage.setItem("ai_chat_conversations", JSON.stringify(convList));
      }
    } catch (err) {
      console.error(err);
      setError("Échec de connexion au serveur chat");
    } finally {
      setLoading(false);
    }
  }

  // Load saved bookmarks and likes on mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("job_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch {}
    }
    const savedLikes = localStorage.getItem("chat_likes");
    if (savedLikes) {
      try {
        setLikedMessages(JSON.parse(savedLikes));
      } catch {}
    }
    void load();
  }, []);

  // Trigger auto-scroll on messages change or active conversation change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 60);
    return () => clearTimeout(timer);
  }, [messages, sending, activeConversationId, scrollToBottom]);

  // Dynamic textarea height adjustment
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [content]);

  // Keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        sidebarSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Send Message Logic
  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;
    setError("");
    setSending(true);
    setContent("");
    userScrolledUpRef.current = false; // user initiated send -> force scroll to bottom

    let currentConvId = activeConversationId;
    let updatedConvs = [...conversations];

    if (currentConvId === "new-chat") {
      currentConvId = `conv-${Date.now()}`;
      const title = text.length > 32 ? `${text.slice(0, 32)}...` : text;
      const newConv: Conversation = {
        id: currentConvId,
        title,
        pinned: false,
        createdAt: new Date().toISOString(),
        messageIds: [],
      };
      updatedConvs = [newConv, ...updatedConvs];
      setConversations(updatedConvs);
      setActiveConversationId(currentConvId);
      localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
    }

    const tempUserMsgId = `temp-user-${Date.now()}`;
    const tempUserMsg: Message = {
      id: tempUserMsgId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, tempUserMsg]);

    const activeConv = updatedConvs.find((c) => c.id === currentConvId);
    if (activeConv) {
      activeConv.messageIds.push(tempUserMsgId);
      localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
    }

    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Le message n'a pas pu être envoyé");
        setMessages((current) => current.filter((m) => m.id !== tempUserMsgId));
        if (activeConv) {
          activeConv.messageIds = activeConv.messageIds.filter((id) => id !== tempUserMsgId);
          localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
        }
      } else {
        setMessages((current) => [
          ...current.filter((m) => m.id !== tempUserMsgId),
          data.userMessage,
          data.assistantMessage,
        ]);

        if (activeConv) {
          activeConv.messageIds = activeConv.messageIds.filter((id) => id !== tempUserMsgId);
          activeConv.messageIds.push(data.userMessage.id, data.assistantMessage.id);
          setConversations([...updatedConvs]);
          localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
        }
      }
    } catch {
      setError("Erreur de connexion avec le serveur. Veuillez réinstaller votre requête.");
      setMessages((current) => current.filter((m) => m.id !== tempUserMsgId));
      if (activeConv) {
        activeConv.messageIds = activeConv.messageIds.filter((id) => id !== tempUserMsgId);
        localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
      }
    } finally {
      setSending(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sendMessage(content);
  }

  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(content);
    }
  }

  function startNewChat() {
    setActiveConversationId("new-chat");
    setSidebarOpen(false);
    setContent("");
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }

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

  function handleShareJob(job: JobCardType) {
    const url = job.sourceUrl || window.location.href;
    void navigator.clipboard.writeText(url);
    setCopiedJobId(job.id);
    setTimeout(() => setCopiedJobId(null), 2000);
  }

  function toggleDetails(jobId: string) {
    if (expandedJobIds.includes(jobId)) {
      setExpandedJobIds(expandedJobIds.filter((id) => id !== jobId));
    } else {
      setExpandedJobIds([...expandedJobIds, jobId]);
    }
  }

  function copyMessageText(msgId: string, text: string) {
    void navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  }

  function handleLikeMessage(msgId: string, type: "like" | "dislike") {
    setLikedMessages((prev) => {
      const next = { ...prev };
      if (next[msgId] === type) {
        delete next[msgId];
      } else {
        next[msgId] = type;
      }
      localStorage.setItem("chat_likes", JSON.stringify(next));
      return next;
    });
  }

  function startEditing(message: Message) {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  }

  async function saveEditedMessage(msgId: string) {
    if (!editContent.trim()) return;

    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (!activeConv) return;

    const msgIndex = activeConv.messageIds.indexOf(msgId);
    if (msgIndex === -1) return;

    const preservedMessageIds = activeConv.messageIds.slice(0, msgIndex);
    activeConv.messageIds = preservedMessageIds;
    setEditingMessageId(null);

    await sendMessage(editContent);
  }

  async function handleRegenerate() {
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (!activeConv || activeConv.messageIds.length === 0) return;

    const conversationMessages = messages.filter((m) => activeConv.messageIds.includes(m.id));
    const userMessages = conversationMessages.filter((m) => m.role === "user");

    if (userMessages.length === 0) return;
    const lastUserMessage = userMessages[userMessages.length - 1];

    const lastUserIndex = activeConv.messageIds.indexOf(lastUserMessage.id);
    activeConv.messageIds = activeConv.messageIds.slice(0, lastUserIndex + 1);
    setConversations([...conversations]);
    localStorage.setItem("ai_chat_conversations", JSON.stringify(conversations));

    await sendMessage(lastUserMessage.content);
  }

  function deleteMessage(msgId: string) {
    const nextConvs = conversations.map((c) => {
      if (c.id === activeConversationId) {
        return { ...c, messageIds: c.messageIds.filter((id) => id !== msgId) };
      }
      return c;
    });
    setConversations(nextConvs);
    localStorage.setItem("ai_chat_conversations", JSON.stringify(nextConvs));
  }

  function togglePinConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = conversations.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c));
    setConversations(next);
    localStorage.setItem("ai_chat_conversations", JSON.stringify(next));
  }

  function startRename(id: string, currentTitle: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRenamingId(id);
    setRenameValue(currentTitle);
  }

  function saveRename(id: string) {
    if (renameValue.trim()) {
      const next = conversations.map((c) => (c.id === id ? { ...c, title: renameValue } : c));
      setConversations(next);
      localStorage.setItem("ai_chat_conversations", JSON.stringify(next));
    }
    setRenamingId(null);
  }

  function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = conversations.filter((c) => c.id !== id);
    setConversations(next);
    localStorage.setItem("ai_chat_conversations", JSON.stringify(next));
    if (activeConversationId === id) {
      setActiveConversationId(next[0]?.id || "new-chat");
    }
  }

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

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.pinned);

  function getGroupedConversations() {
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const last7Days: Conversation[] = [];
    const older: Conversation[] = [];

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    unpinnedConversations.forEach((c) => {
      const date = new Date(c.createdAt);
      const diff = now.getTime() - date.getTime();

      if (diff < oneDay && now.getDate() === date.getDate()) {
        today.push(c);
      } else if (diff < 2 * oneDay && new Date(now.getTime() - oneDay).getDate() === date.getDate()) {
        yesterday.push(c);
      } else if (diff < 7 * oneDay) {
        last7Days.push(c);
      } else {
        older.push(c);
      }
    });

    return { today, yesterday, last7Days, older };
  }

  const grouped = getGroupedConversations();

  const activeConvObj = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConvObj
    ? messages.filter((m) => activeConvObj.messageIds.includes(m.id))
    : [];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Top Header Bar */}
      <header className="shrink-0 flex items-center justify-between border-b border-slate-200 px-6 py-3.5 bg-white select-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="xl:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              {activeConvObj ? activeConvObj.title : "AlgoJob AI Assistant"}
            </h2>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>En ligne · Gemini & Ever Jobs Engine</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startNewChat}
            className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm active:scale-95"
          >
            <Plus size={14} />
            Nouvelle conversation
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Actualiser l'historique"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      {/* Main Body Layout (Sidebar + Chat Area) */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <aside
          className={`absolute xl:relative inset-y-0 left-0 z-30 w-[280px] bg-slate-50/70 border-r border-slate-200 flex flex-col min-h-0 overflow-hidden transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full xl:translate-x-0"
          }`}
        >
          {/* Top Actions in Sidebar */}
          <div className="p-3 border-b border-slate-200 space-y-2 shrink-0">
            <button
              type="button"
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <Plus size={14} />
              Nouveau Chat
            </button>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={sidebarSearchRef}
                type="text"
                placeholder="Rechercher... (Cmd+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 pl-9 pr-3 py-1.5 rounded-xl text-xs outline-none focus:border-blue-500 transition text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Scrollable Conversations List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 font-medium text-xs">
            {pinnedConversations.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-2 flex items-center gap-1">
                  <Pin size={10} className="rotate-45 text-blue-500" /> Ancré
                </p>
                <div className="space-y-1">
                  {pinnedConversations.map((c) => renderSidebarItem(c))}
                </div>
              </div>
            )}

            {grouped.today.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-2">Aujourd&apos;hui</p>
                <div className="space-y-1">
                  {grouped.today.map((c) => renderSidebarItem(c))}
                </div>
              </div>
            )}

            {grouped.yesterday.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-2">Hier</p>
                <div className="space-y-1">
                  {grouped.yesterday.map((c) => renderSidebarItem(c))}
                </div>
              </div>
            )}

            {grouped.last7Days.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-2">7 derniers jours</p>
                <div className="space-y-1">
                  {grouped.last7Days.map((c) => renderSidebarItem(c))}
                </div>
              </div>
            )}

            {grouped.older.length > 0 && (
              <div>
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 px-2">Plus anciens</p>
                <div className="space-y-1">
                  {grouped.older.map((c) => renderSidebarItem(c))}
                </div>
              </div>
            )}

            {conversations.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Sparkles size={20} className="mx-auto mb-2 opacity-50" />
                <p className="text-xs">Aucune conversation</p>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-xs xl:hidden"
          />
        )}

        {/* Conversation & Composer Column */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white relative">
          {error && (
            <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
              <button type="button" onClick={() => setError("")} className="hover:opacity-75">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Conversation Messages Container (ONLY SCROLLABLE REGION) */}
          <div
            ref={messageLogRef}
            onScroll={handleScroll}
            className="flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scroll-smooth"
          >
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent" />
                  <p className="mt-2 text-xs font-semibold text-slate-400">Chargement de la conversation...</p>
                </div>
              </div>
            ) : activeMessages.length === 0 ? (
              /* Welcome Screen when starting a new conversation */
              <div className="flex h-full flex-col items-center justify-center max-w-2xl mx-auto text-center px-4 py-8">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mb-4 shadow-sm">
                  <Sparkles size={24} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Bonjour{currentUser?.name ? `, ${currentUser.name}` : ""}
                </h1>
                <p className="text-slate-500 text-sm mt-1 mb-8 max-w-md">
                  Posez vos questions sur les offres de stages, emplois tech, salaires, ou conseils de carrière.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                  {QUICK_CHIPS.map((chip, idx) => {
                    const icons = [Search, Briefcase, FileText, Globe];
                    const Icon = icons[idx % icons.length];
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setContent(chip);
                          sendMessage(chip);
                        }}
                        className="flex flex-col justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 text-slate-700 text-xs font-medium transition shadow-xs group cursor-pointer"
                      >
                        <span className="leading-relaxed mb-4">{chip}</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">Recherche rapide</span>
                          <div className="h-6 w-6 rounded-lg bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-600 flex items-center justify-center transition">
                            <Icon size={12} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {activeMessages.map((message) => {
                  const isUser = message.role === "user";
                  const meta = getMetadata(message);
                  const showJobs = meta?.jobs && meta.jobs.length > 0;
                  const isEditing = editingMessageId === message.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"} group/msg`}
                    >
                      {!isUser && (
                        <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                          <Bot size={16} />
                        </div>
                      )}

                      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                        {isEditing ? (
                          <div className="w-full bg-white border border-slate-200 rounded-xl p-3 shadow-md">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full text-sm outline-none resize-none p-2 border border-slate-200 rounded-lg focus:border-blue-500 text-slate-800"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => setEditingMessageId(null)}
                                className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg font-semibold"
                              >
                                Annuler
                              </button>
                              <button
                                type="button"
                                onClick={() => saveEditedMessage(message.id)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group/bubble w-full">
                            <div
                              className={`text-sm leading-relaxed ${
                                isUser
                                  ? "bg-slate-100 text-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs font-medium whitespace-pre-wrap"
                                  : "text-slate-800 py-1"
                              }`}
                              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
                            >
                              {isUser ? message.content : renderMarkdown(message.content)}

                              {!isUser && meta?.metrics && (
                                <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400 font-medium select-none">
                                  <span>⏱ Temps AI: {meta.metrics.responseTime}ms</span>
                                  {meta.metrics.backendLatency && (
                                    <span>🔌 Latence API: {meta.metrics.backendLatency}ms</span>
                                  )}
                                  <span>🔍 Offres trouvées: {meta.metrics.resultCount}</span>
                                </div>
                              )}
                            </div>

                            {/* Floating Toolbar on Hover */}
                            <div
                              className={`absolute -top-9 opacity-0 group-hover/bubble:opacity-100 transition-opacity duration-150 flex items-center bg-white border border-slate-200 rounded-lg shadow-sm p-0.5 gap-0.5 z-10 ${
                                isUser ? "right-0" : "left-0"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => copyMessageText(message.id, message.content)}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                                title="Copier"
                              >
                                {copiedMessageId === message.id ? (
                                  <Check size={12} className="text-emerald-500" />
                                ) : (
                                  <Copy size={12} />
                                )}
                              </button>

                              {isUser ? (
                                <button
                                  type="button"
                                  onClick={() => startEditing(message)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                                  title="Modifier"
                                >
                                  <Edit3 size={12} />
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleLikeMessage(message.id, "like")}
                                    className={`p-1 hover:bg-slate-100 rounded ${
                                      likedMessages[message.id] === "like" ? "text-emerald-600" : "text-slate-400"
                                    }`}
                                    title="J'aime"
                                  >
                                    <ThumbsUp size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleLikeMessage(message.id, "dislike")}
                                    className={`p-1 hover:bg-slate-100 rounded ${
                                      likedMessages[message.id] === "dislike" ? "text-rose-600" : "text-slate-400"
                                    }`}
                                    title="Je n'aime pas"
                                  >
                                    <ThumbsDown size={12} />
                                  </button>
                                </>
                              )}

                              <button
                                type="button"
                                onClick={() => deleteMessage(message.id)}
                                className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400"
                                title="Supprimer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Interactive Job Cards Grid */}
                        {!isUser && showJobs && meta?.jobs && (
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
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
                                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-bold text-slate-900 truncate">
                                          {job.sourceUrl ? (
                                            <a
                                              href={job.sourceUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="hover:text-blue-600 hover:underline"
                                            >
                                              {job.title}
                                            </a>
                                          ) : (
                                            job.title
                                          )}
                                        </h4>
                                        <span className="text-xs text-slate-500 font-semibold block mt-0.5 truncate">
                                          {job.company}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => toggleBookmark(job.id)}
                                        className={`p-1.5 rounded-lg border transition ${
                                          isBookmarked
                                            ? "bg-amber-50 border-amber-200 text-amber-500"
                                            : "border-slate-200 text-slate-400 hover:text-slate-600"
                                        }`}
                                      >
                                        <Bookmark size={13} fill={isBookmarked ? "currentColor" : "none"} />
                                      </button>
                                    </div>

                                    <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md uppercase">
                                        {job.contract.replace("_", " ")}
                                      </span>
                                      <span className="bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <MapPin size={9} />
                                        {job.city}
                                      </span>
                                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Globe size={9} />
                                        {job.source}
                                      </span>
                                    </div>

                                    {job.skills.length > 0 && (
                                      <div className="mt-2.5 flex flex-wrap gap-1">
                                        {job.skills.slice(0, 3).map((skill) => (
                                          <span
                                            key={skill}
                                            className="bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-500"
                                          >
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {isExpanded && (
                                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 text-xs text-slate-600 space-y-1.5">
                                        {formattedSalary && (
                                          <div className="flex items-center gap-1">
                                            <DollarSign size={12} className="text-emerald-600" />
                                            <span>
                                              <strong>Salaire:</strong> {formattedSalary}
                                            </span>
                                          </div>
                                        )}
                                        {job.publishedAt && (
                                          <div className="flex items-center gap-1">
                                            <Calendar size={12} className="text-blue-600" />
                                            <span>
                                              <strong>Publié:</strong>{" "}
                                              {new Date(job.publishedAt).toLocaleDateString()}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                      type="button"
                                      onClick={() => toggleDetails(job.id)}
                                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                                    >
                                      {isExpanded ? (
                                        <>
                                          Masquer <ChevronUp size={12} />
                                        </>
                                      ) : (
                                        <>
                                          Détails <ChevronDown size={12} />
                                        </>
                                      )}
                                    </button>

                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleShareJob(job)}
                                        className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700"
                                        title="Copier le lien"
                                      >
                                        {copiedJobId === job.id ? (
                                          <Check size={13} className="text-emerald-500" />
                                        ) : (
                                          <Share2 size={13} />
                                        )}
                                      </button>
                                      {job.sourceUrl && (
                                        <a
                                          href={job.sourceUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-lg inline-flex items-center gap-1"
                                        >
                                          Postuler <ExternalLink size={11} />
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

                      {isUser && (
                        <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200 mt-1">
                          {currentUser?.name
                            ? currentUser.name.slice(0, 2).toUpperCase()
                            : currentUser?.email
                            ? currentUser.email.slice(0, 2).toUpperCase()
                            : "U"}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Thinking Animation */}
                {sending && (
                  <div className="flex gap-4 items-start">
                    <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} />
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">
                        AlgoJob AI analyse et recherche les offres...
                      </span>
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600" />
                        <div
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-600"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Scroll to bottom floating indicator */}
          {showScrollBottomBtn && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 shadow-md rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all z-20 cursor-pointer"
            >
              <ChevronDown size={14} className="animate-bounce text-blue-600" />
              Défiler vers le bas
            </button>
          )}


          {/* FIXED COMPOSER (ALWAYS VISIBLE AT BOTTOM) */}
          <div className="shrink-0 border-t border-slate-200 p-4 bg-white">
            <div className="max-w-4xl mx-auto space-y-2">
              {/* Quick chips bar when message list exists */}
              {activeMessages.length > 0 && (
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 select-none">
                  <div className="flex gap-1.5">
                    {QUICK_CHIPS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setContent(chip);
                          sendMessage(chip);
                        }}
                        disabled={sending}
                        className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition disabled:opacity-50"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {!sending && activeMessages.length > 1 && (
                    <button
                      type="button"
                      onClick={handleRegenerate}
                      className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold whitespace-nowrap"
                    >
                      <RotateCw size={12} />
                      Régénérer
                    </button>
                  )}
                </div>
              )}

              {/* Message Input Form */}
              <form
                onSubmit={submit}
                className="flex flex-col bg-slate-50/80 border border-slate-300 rounded-2xl p-2.5 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition"
              >
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  disabled={sending}
                  placeholder="Écrivez votre message..."
                  className="w-full min-h-[44px] max-h-[160px] text-sm bg-transparent outline-none border-none py-1.5 px-3 resize-none text-slate-800 placeholder-slate-400 font-medium leading-relaxed"
                  rows={1}
                />

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 px-1">
                  <div className="flex items-center gap-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setContent((prev) => `${prev} [Fichier: ${file.name}] `);
                        }
                      }}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={sending}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition disabled:opacity-50"
                      title="Joindre un fichier"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!content.trim() || sending}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 transition shadow-xs active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                    aria-label="Envoyer"
                  >
                    <Send size={14} className={sending ? "animate-pulse" : ""} />
                  </button>
                </div>
              </form>

              <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 font-medium">
                <span>Appuyez sur Entrée pour envoyer, Shift+Entrée pour sauter une ligne</span>
                <span>ChatGPT Style · AlgoJob AI</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

  // Render Sidebar Conversation Item
  function renderSidebarItem(c: Conversation) {
    const isActive = activeConversationId === c.id;
    const isRenaming = renamingId === c.id;

    return (
      <div
        key={c.id}
        onClick={() => {
          setActiveConversationId(c.id);
          setSidebarOpen(false);
        }}
        className={`group relative flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs cursor-pointer transition border ${
          isActive
            ? "bg-white text-blue-600 border-slate-200 font-bold shadow-xs"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-transparent"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Globe size={12} className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />

          {isRenaming ? (
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => saveRename(c.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveRename(c.id);
                if (e.key === "Escape") setRenamingId(null);
              }}
              autoFocus
              className="w-full bg-white border border-slate-300 px-1.5 py-0.5 rounded text-slate-800 text-xs outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate flex-1 font-medium">{c.title}</span>
          )}
        </div>

        {!isRenaming && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition">
            <button
              type="button"
              onClick={(e) => togglePinConversation(c.id, e)}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
              title={c.pinned ? "Désancrer" : "Ancrer"}
            >
              <Pin size={10} className={c.pinned ? "fill-current text-blue-600 rotate-45" : "rotate-45"} />
            </button>
            <button
              type="button"
              onClick={(e) => startRename(c.id, c.title, e)}
              className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700"
              title="Renommer"
            >
              <Edit3 size={10} />
            </button>
            <button
              type="button"
              onClick={(e) => deleteConversation(c.id, e)}
              className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400"
              title="Supprimer"
            >
              <Trash2 size={10} />
            </button>
          </div>
        )}
      </div>
    );
  }
}
