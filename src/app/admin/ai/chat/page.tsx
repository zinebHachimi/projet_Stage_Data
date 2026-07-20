"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AdminCard } from "@/components/admin/AdminShell";
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
  
  // Conversation History states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("new-chat");
  const [searchQuery, setSearchQuery] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Message interaction states
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [likedMessages, setLikedMessages] = useState<Record<string, "like" | "dislike">>({});
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name?: string | null; email: string; role: string } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);

  // Load chat messages and conversations
  async function load() {
    setLoading(true);
    try {
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      if (userRes.ok && userData.user) {
        setCurrentUser(userData.user);
      }

      const res = await fetch("/api/admin/chat", { cache: "no-store" });
      const data: Message[] = await res.json();
      if (!res.ok) {
        setError("Unable to load chat history");
      } else {
        setMessages(data);
        
        // Load or initialize conversations
        const savedConvs = localStorage.getItem("ai_chat_conversations");
        let convList: Conversation[] = [];
        if (savedConvs) {
          try {
            convList = JSON.parse(savedConvs);
          } catch {}
        }
        
        if (convList.length === 0 && data.length > 0) {
          // Group existing messages into one default conversation
          const messageIds = data.map((m) => m.id);
          const defaultConv: Conversation = {
            id: "default-conv",
            title: "Historique de chat",
            pinned: false,
            createdAt: data[0]?.createdAt || new Date().toISOString(),
            messageIds,
          };
          convList = [defaultConv];
          setActiveConversationId("default-conv");
        } else if (convList.length > 0) {
          // Sync any new messages from DB not already in conversations (e.g. sent from another device)
          const allCategorizedIds = new Set(convList.flatMap((c) => c.messageIds));
          const orphans = data.filter((m) => !allCategorizedIds.has(m.id));
          if (orphans.length > 0) {
            // Add orphans to the most recent conversation, or create one
            const targetConv = convList[0];
            if (targetConv) {
              targetConv.messageIds = [...targetConv.messageIds, ...orphans.map((m) => m.id)];
            }
          }
          
          // Set active conversation to the first pinned, or the first in the list
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
    } catch {
      setError("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  }

  // Load bookmarks & feedback from local storage
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

  // Scroll to bottom on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, sending, activeConversationId]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [content]);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
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

  // Handle message sending
  async function sendMessage(text: string) {
    if (!text.trim() || sending) return;
    setError("");
    setSending(true);
    setContent("");

    let currentConvId = activeConversationId;
    let updatedConvs = [...conversations];

    // Create a new conversation if on "new-chat" state
    if (currentConvId === "new-chat") {
      currentConvId = `conv-${Date.now()}`;
      const title = text.length > 28 ? `${text.slice(0, 28)}...` : text;
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

    // Optimistic user message insertion
    const tempUserMsgId = `temp-user-${Date.now()}`;
    const tempUserMsg: Message = {
      id: tempUserMsgId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    
    setMessages((current) => [...current, tempUserMsg]);
    
    // Add message ID optimistically to the active conversation
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
        setError(data.error ?? "Message failed to send");
        // Remove the optimistic message on error
        setMessages((current) => current.filter((m) => m.id !== tempUserMsgId));
        if (activeConv) {
          activeConv.messageIds = activeConv.messageIds.filter((id) => id !== tempUserMsgId);
          localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
        }
      } else {
        // Replace optimistic message and append assistant message
        setMessages((current) => [
          ...current.filter((m) => m.id !== tempUserMsgId),
          data.userMessage,
          data.assistantMessage,
        ]);

        // Update the conversation with final DB message IDs
        if (activeConv) {
          activeConv.messageIds = activeConv.messageIds.filter((id) => id !== tempUserMsgId);
          activeConv.messageIds.push(data.userMessage.id, data.assistantMessage.id);
          setConversations([...updatedConvs]);
          localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
        }
      }
    } catch {
      setError("Server connection failed. Retrying...");
      setMessages((current) => current.filter((m) => m.id !== tempUserMsgId));
      if (activeConv) {
        activeConv.messageIds = activeConv.messageIds.filter((id) => id !== tempUserMsgId);
        localStorage.setItem("ai_chat_conversations", JSON.stringify(updatedConvs));
      }
    } finally {
      setSending(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sendMessage(content);
  }

  // Handle textarea enter submit
  function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(content);
    }
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

  // Sharing job handler
  function handleShareJob(job: JobCardType) {
    const url = job.sourceUrl || window.location.href;
    void navigator.clipboard.writeText(url);
    setCopiedJobId(job.id);
    setTimeout(() => setCopiedJobId(null), 2000);
  }

  // Expand job card handler
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

  // Message Floating Toolbar Actions
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

  // Edit Message
  function startEditing(message: Message) {
    setEditingMessageId(message.id);
    setEditContent(message.content);
  }

  async function saveEditedMessage(msgId: string) {
    if (!editContent.trim()) return;
    
    // Find active conversation
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (!activeConv) return;
    
    // Find index of this message in active conversation's message list
    const msgIndex = activeConv.messageIds.indexOf(msgId);
    if (msgIndex === -1) return;

    // Truncate messages after this message ID locally to restart flow
    const preservedMessageIds = activeConv.messageIds.slice(0, msgIndex);
    
    // Update local state and conversation
    activeConv.messageIds = preservedMessageIds;
    setEditingMessageId(null);
    
    // Send message again with new content
    await sendMessage(editContent);
  }

  // Regenerate last AI response
  async function handleRegenerate() {
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    if (!activeConv || activeConv.messageIds.length === 0) return;

    // Find the last user message in this conversation
    const conversationMessages = messages.filter((m) => activeConv.messageIds.includes(m.id));
    const userMessages = conversationMessages.filter((m) => m.role === "user");
    
    if (userMessages.length === 0) return;
    const lastUserMessage = userMessages[userMessages.length - 1];

    // Remove the last assistant message and subsequent messages
    const lastUserIndex = activeConv.messageIds.indexOf(lastUserMessage.id);
    activeConv.messageIds = activeConv.messageIds.slice(0, lastUserIndex + 1);
    setConversations([...conversations]);
    localStorage.setItem("ai_chat_conversations", JSON.stringify(conversations));

    // Resend the last user prompt
    await sendMessage(lastUserMessage.content);
  }

  // Delete message locally
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

  // Conversation Sidebar Management
  function startNewChat() {
    setActiveConversationId("new-chat");
    setSidebarOpen(false);
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

  // Conversation History Grouping
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.pinned);

  // Group unpinned conversations by date
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

  // Active Messages Filtered
  const activeConvObj = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConvObj
    ? messages.filter((m) => activeConvObj.messageIds.includes(m.id))
    : [];

  // Drag and Drop simulation
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setContent((prev) => `${prev} [Attachment: ${file.name}] `);
    }
  }

  function triggerFileSelect() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setContent((prev) => `${prev} [Attachment: ${file.name}] `);
    }
  }

  // Sane timestamps
  function formatTimestamp(isoStr: string) {
    try {
      const date = new Date(isoStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  }

  // Zero-dependency rich markdown + inline codes rendering
  function renderMarkdown(contentStr: string) {
    if (!contentStr) return "";
    
    // Split by code blocks first
    const blocks = contentStr.split(/(```[\s\S]*?```)/g);
    
    return blocks.map((block, idx) => {
      if (block.startsWith("```") && block.endsWith("```")) {
        const match = block.match(/```(\w*)\n([\s\S]*?)```/);
        const lang = match ? match[1] : "";
        const code = match ? match[2] : block.slice(3, -3);
        return (
          <div key={idx} className="my-3 rounded-xl border border-slate-200 overflow-hidden text-xs font-mono bg-slate-900 text-slate-100 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between bg-slate-800/80 px-4 py-2 border-b border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400">{lang || "code"}</span>
              <button
                onClick={() => {
                  void navigator.clipboard.writeText(code.trim());
                  alert("Copied code to clipboard!");
                }}
                className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-white transition"
              >
                <Copy size={12} />
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto select-text">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }
      
      // Inline lines formatting
      const lines = block.split("\n");
      let inList = false;
      let listItems: string[] = [];
      const nodes: React.ReactNode[] = [];

      const flushList = (key: string) => {
        if (listItems.length > 0) {
          nodes.push(
            <ul key={key} className="list-disc pl-5 my-2 space-y-1.5 animate-fade-in">
              {listItems.map((item, i) => (
                <li key={i} className="text-slate-800 leading-relaxed text-sm select-text">
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
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          if (!inList) {
            flushList(`list-before-${idx}-${lineIdx}`);
            inList = true;
          }
          listItems.push(trimmed.slice(2));
        } else if (/^\d+\.\s/.test(trimmed)) {
          flushList(`list-before-${idx}-${lineIdx}`);
          const matchNum = trimmed.match(/^\d+\.\s/)?.[0] || "";
          nodes.push(
            <div key={`num-${idx}-${lineIdx}`} className="pl-4 my-1.5 flex gap-2 text-sm select-text animate-fade-in">
              <span className="font-semibold text-[#5d87ff] shrink-0">{matchNum}</span>
              <div className="text-slate-800 leading-relaxed">{parseInlineElements(trimmed.replace(/^\d+\.\s/, ""))}</div>
            </div>
          );
        } else {
          flushList(`list-before-${idx}-${lineIdx}`);
          if (trimmed === "") {
            nodes.push(<div key={`br-${idx}-${lineIdx}`} className="h-2" />);
          } else {
            nodes.push(
              <p key={`p-${idx}-${lineIdx}`} className="my-1.5 text-slate-800 leading-relaxed text-sm select-text animate-fade-in">
                {parseInlineElements(line)}
              </p>
            );
          }
        }
      });

      flushList(`list-end-${idx}`);
      return <div key={`text-block-${idx}`}>{nodes}</div>;
    });
  }

  function parseInlineElements(text: string): React.ReactNode[] {
    let parts: Array<{ type: "text" | "bold" | "italic" | "code" | "link"; text: string; url?: string }> = [
      { type: "text", text },
    ];

    // Links: [label](url)
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

    // Bold: **text**
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

    // Inline Code: `code`
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

    // Italic: *text*
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
          return <code key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-[#5d87ff]">{p.text}</code>;
        case "link":
          return (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="text-[#5d87ff] hover:underline font-medium inline-flex items-center gap-0.5">
              {p.text}
              <ExternalLink size={10} className="inline-block" />
            </a>
          );
        default:
          return p.text;
      }
    });
  }

  return (
    <div
      className="flex gap-6 h-[calc(100vh-210px)] min-h-0 relative overflow-hidden bg-[#f8fafc]"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Styles for transitions and animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>

      {/* Drag & Drop Overlay */}
      {dragging && (
        <div className="absolute inset-0 bg-[#5d87ff]/10 backdrop-blur-[2px] border-2 border-dashed border-[#5d87ff] rounded-xl z-50 flex flex-col items-center justify-center pointer-events-none transition-all duration-200">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
            <Paperclip size={40} className="text-[#5d87ff] animate-bounce" />
            <h4 className="font-bold text-slate-800">Déposer vos fichiers ici</h4>
            <p className="text-xs text-slate-500">Ajouter des documents à votre message</p>
          </div>
        </div>
      )}

      {/* Sidebar: Conversation history */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-white border border-[#dfe5ef] rounded-xl p-4 flex flex-col gap-4 transition-transform duration-300 xl:static xl:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Sparkles size={18} className="text-[#5d87ff]" />
            Conversations
          </h3>
          <button
            onClick={startNewChat}
            className="flex items-center gap-1 bg-[#ecf2ff] hover:bg-[#5d87ff] hover:text-white transition px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5d87ff]"
          >
            <Plus size={14} />
            Nouveau
          </button>
        </div>

        {/* Search Conversation */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-slate-400" />
          <input
            ref={sidebarSearchRef}
            type="text"
            placeholder="Rechercher... (Cmd+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-[#dfe5ef] pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-[#5d87ff] focus:bg-white transition"
          />
        </div>

        {/* History Grouped List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 chat-scroll">
          {/* Pinned Conversations */}
          {pinnedConversations.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                <Pin size={10} className="rotate-45" /> Ancré
              </p>
              <div className="space-y-1">
                {pinnedConversations.map((c) => renderConversationItem(c))}
              </div>
            </div>
          )}

          {/* Grouped conversations */}
          {grouped.today.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Aujourd&apos;hui</p>
              <div className="space-y-1">
                {grouped.today.map((c) => renderConversationItem(c))}
              </div>
            </div>
          )}

          {grouped.yesterday.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Hier</p>
              <div className="space-y-1">
                {grouped.yesterday.map((c) => renderConversationItem(c))}
              </div>
            </div>
          )}

          {grouped.last7Days.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">7 derniers jours</p>
              <div className="space-y-1">
                {grouped.last7Days.map((c) => renderConversationItem(c))}
              </div>
            </div>
          )}

          {grouped.older.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Plus anciens</p>
              <div className="space-y-1">
                {grouped.older.map((c) => renderConversationItem(c))}
              </div>
            </div>
          )}

          {conversations.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-6">Aucune conversation</p>
          )}
        </div>
      </aside>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-[1px] xl:hidden"
        />
      )}

      {/* Main Chat Area */}
      <AdminCard className="flex-1 flex flex-col h-full overflow-hidden p-0 rounded-xl relative shadow-md">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#dfe5ef] px-6 py-4 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="xl:hidden p-1 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              <Menu size={20} />
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecf2ff] text-[#5d87ff]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                {activeConvObj ? activeConvObj.title : "Assistant Recrutement AI"}
              </h2>
              <p className="text-xs text-[#5a6a85bf] flex items-center gap-1 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Propulsé par Gemini & AlgoJob
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => void load()}
              className="text-xs font-semibold text-[#5d87ff] bg-[#ecf2ff] hover:bg-[#5d87ff] hover:text-white px-3.5 py-1.5 rounded-lg transition"
            >
              Actualiser
            </button>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-xl bg-red-50 p-4 text-sm text-red-500 border border-red-100 flex items-center justify-between shadow-sm animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold">Erreur :</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError("")} className="font-bold hover:opacity-80 p-1">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/50 p-6 space-y-6 chat-scroll" style={{ minHeight: 0 }}>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#5d87ff] border-r-transparent" />
                <p className="mt-2 text-xs font-semibold text-[#5a6a85bf]">Chargement de l&apos;historique...</p>
              </div>
            </div>
          ) : activeMessages.length === 0 ? (
            /* Welcome empty state (Gemini Style) */
            <div className="flex h-full flex-col items-center justify-center text-center p-6 max-w-4xl mx-auto select-none animate-fade-in">
              <h2 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent text-4xl md:text-5xl font-extrabold tracking-tight">
                Bonjour, {currentUser?.name || currentUser?.email.split("@")[0] || "Candidat"}
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-slate-400 mt-2">
                Que puis-je faire pour vous aujourd&apos;hui ?
              </h3>
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full px-4">
                {QUICK_CHIPS.map((chip, idx) => {
                  const icons = [Search, Briefcase, FileText, Globe];
                  const Icon = icons[idx % icons.length];
                  return (
                    <button
                      key={chip}
                      onClick={() => {
                        setContent(chip);
                        sendMessage(chip);
                      }}
                      className="flex flex-col justify-between p-5 h-36 rounded-2xl bg-white border border-[#dfe5ef] hover:border-[#5d87ff]/40 hover:bg-blue-50/20 text-slate-700 hover:text-slate-800 text-xs font-semibold text-left transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                    >
                      <span className="leading-relaxed">{chip}</span>
                      <div className="h-8 w-8 rounded-lg bg-slate-50 group-hover:bg-blue-100/50 text-slate-400 group-hover:text-[#5d87ff] flex items-center justify-center transition-colors">
                        <Icon size={16} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeMessages.map((message) => {
                const isUser = message.role === "user";
                const meta = getMetadata(message);
                const showJobs = meta?.jobs && meta.jobs.length > 0;
                const isEditing = editingMessageId === message.id;

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col group relative ${isUser ? "items-end" : "items-start"}`}
                  >
                    {/* Message bubble wrapper */}
                    <div className="flex items-start gap-4 max-w-[85%] relative w-full">
                      {!isUser ? (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 text-white shadow-sm mt-0.5 animate-fade-in">
                          <Sparkles size={14} />
                        </div>
                      ) : null}
                      
                      <div className="flex flex-col gap-1 relative flex-1 min-w-0">
                        {isEditing ? (
                          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md w-[400px] max-w-full">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              className="w-full text-sm outline-none resize-none p-2 border border-slate-100 rounded-lg focus:border-[#5d87ff]"
                              rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={() => setEditingMessageId(null)}
                                className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => saveEditedMessage(message.id)}
                                className="px-3 py-1.5 text-xs bg-[#5d87ff] text-white rounded-lg hover:bg-[#4b73df]"
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`text-sm leading-relaxed select-text relative transition-all duration-200 break-words overflow-hidden ${
                              isUser
                                ? "bg-slate-100 text-slate-800 px-5 py-3 rounded-3xl rounded-tr-none ml-auto max-w-[85%]"
                                : "text-slate-800 px-0 py-1.5 bg-transparent border-none shadow-none"
                            }`}
                            style={{ wordBreak: "break-word" }}
                          >
                            {isUser ? message.content : renderMarkdown(message.content)}

                            {/* Search metrics details */}
                            {!isUser && meta?.metrics && (
                              <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#5a6a85bf] font-medium select-none">
                                <span>⏱️ AI response: {meta.metrics.responseTime}ms</span>
                                {meta.metrics.backendLatency && (
                                  <span>🔌 API Latency: {meta.metrics.backendLatency}ms</span>
                                )}
                                <span>🔍 Found {meta.metrics.resultCount} jobs</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Floating message toolbar on hover */}
                        {!isEditing && (
                          <div
                            className={`absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center bg-white border border-[#dfe5ef] rounded-lg shadow-md p-1 z-10 gap-0.5 ${
                              isUser ? "right-0" : "left-12"
                            }`}
                          >
                            <button
                              onClick={() => copyMessageText(message.id, message.content)}
                              className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
                              title="Copier le texte"
                            >
                              {copiedMessageId === message.id ? (
                                <Check size={13} className="text-emerald-500" />
                              ) : (
                                <Copy size={13} />
                              )}
                            </button>
                            
                            {isUser ? (
                              <button
                                onClick={() => startEditing(message)}
                                className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition"
                                title="Modifier le message"
                              >
                                <Edit3 size={13} />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleLikeMessage(message.id, "like")}
                                  className={`p-1.5 hover:bg-slate-100 rounded transition ${
                                    likedMessages[message.id] === "like"
                                      ? "text-emerald-600 bg-emerald-50"
                                      : "text-slate-500 hover:text-emerald-600"
                                  }`}
                                  title="J'aime"
                                >
                                  <ThumbsUp size={13} />
                                </button>
                                <button
                                  onClick={() => handleLikeMessage(message.id, "dislike")}
                                  className={`p-1.5 hover:bg-slate-100 rounded transition ${
                                    likedMessages[message.id] === "dislike"
                                      ? "text-rose-600 bg-rose-50"
                                      : "text-slate-500 hover:text-rose-600"
                                  }`}
                                  title="Je n'aime pas"
                                >
                                  <ThumbsDown size={13} />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="p-1.5 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-500 transition"
                              title="Supprimer localement"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}

                        {/* Timestamp & feedback status */}
                        <div className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end px-1" : "pl-0"}`}>
                          <span className="text-[10px] text-slate-400">
                            {formatTimestamp(message.createdAt)}
                          </span>
                          {likedMessages[message.id] && (
                            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                              {likedMessages[message.id] === "like" ? (
                                <ThumbsUp size={8} className="text-emerald-500" />
                              ) : (
                                <ThumbsDown size={8} className="text-rose-500" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Job Cards Layout inside log */}
                    {!isUser && showJobs && meta?.jobs && (
                      <div className="mt-4 pl-12 w-full grid grid-cols-12 gap-4 max-w-[95%]">
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
                                {/* Header */}
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
                                    title={isBookmarked ? "Retirer favori" : "Ajouter aux favoris"}
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
                                        +{job.skills.length - 4} de plus
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
                                          <strong>Salaire estimé:</strong> {formattedSalary}
                                        </span>
                                      </div>
                                    )}
                                    {job.publishedAt && (
                                      <div className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-[#5d87ff]" />
                                        <span>
                                          <strong>Date de publication:</strong>{" "}
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
                                      Masquer <ChevronUp size={14} />
                                    </>
                                  ) : (
                                    <>
                                      Détails <ChevronDown size={14} />
                                    </>
                                  )}
                                </button>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleShareJob(job)}
                                    className="rounded-lg p-1.5 border border-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition"
                                    title="Copier le lien"
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
                                      Postuler <ExternalLink size={12} />
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

              {/* Typing Loader thinking animation */}
              {sending && (
                <div className="flex items-start gap-3 max-w-[85%] animate-pulse">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#5d87ff] to-cyan-400 text-white font-bold text-xs shadow-sm">
                    AJ
                  </div>
                  <div className="rounded-2xl rounded-tl-none bg-white text-slate-800 border border-[#dfe5ef] px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">Recherche d&apos;offres en cours</span>
                      <div className="flex gap-1">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5d87ff]" />
                        <div
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5d87ff]"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#5d87ff]"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input and actions area container */}
        <div className="border-t border-[#dfe5ef] p-4 bg-white shrink-0 flex flex-col gap-2">
          {/* Preset quick-chips helper if conversations have messages */}
          {activeMessages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-2 overflow-x-auto select-none">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setContent(chip);
                    sendMessage(chip);
                  }}
                  disabled={sending}
                  className="rounded-full bg-white border border-[#dfe5ef] px-3 py-1 text-xs text-slate-600 hover:border-[#5d87ff] hover:text-[#5d87ff] hover:bg-[#ecf2ff]/20 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
              
              {/* Regenerate floating option */}
              {!sending && activeMessages.length > 1 && (
                <button
                  onClick={handleRegenerate}
                  className="rounded-full bg-white border border-[#dfe5ef] px-3 py-1 text-xs text-slate-600 hover:border-[#5d87ff] hover:text-[#5d87ff] flex items-center gap-1 transition"
                >
                  <RotateCw size={12} />
                  Régénérer
                </button>
              )}
            </div>
          )}

          {/* Input Form Area */}
          <form onSubmit={submit} className="flex items-end gap-2 bg-slate-50 border border-[#dfe5ef] rounded-2xl p-2 focus-within:border-[#5d87ff] focus-within:bg-white focus-within:shadow-[0_2px_12px_rgba(93,135,255,0.08)] transition-all">
            {/* Simulated attachment button */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={sending}
              className="p-2.5 rounded-xl hover:bg-slate-200/50 text-slate-500 hover:text-slate-800 transition disabled:opacity-50 shrink-0"
              title="Ajouter un document"
            >
              <Paperclip size={18} />
            </button>

            {/* Textarea Input (Auto expanding) */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              disabled={sending}
              placeholder="Posez vos questions sur les offres de stages, le télétravail..."
              className="flex-1 max-h-[180px] min-h-[40px] text-sm bg-transparent outline-none border-none py-2 px-1 resize-none text-slate-800 placeholder-slate-400 font-medium"
              rows={1}
            />

            {/* Submit Send Button with visual feedback */}
            <button
              type="submit"
              disabled={!content.trim() || sending}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] disabled:bg-slate-200 text-white shadow-sm transition disabled:text-slate-400 disabled:cursor-not-allowed"
            >
              <Send size={16} className={sending ? "animate-pulse" : ""} />
            </button>
          </form>

          {/* Shortcut details */}
          <div className="flex justify-between items-center text-[10px] text-[#5a6a85bf] px-1 select-none">
            <span>Entrée pour envoyer, Shift+Entrée pour nouvelle ligne.</span>
            <span>Glissez-déposez pour joindre.</span>
          </div>
        </div>
      </AdminCard>
    </div>
  );

  // Render a Single Sidebar Conversation Item
  function renderConversationItem(c: Conversation) {
    const isActive = activeConversationId === c.id;
    const isRenaming = renamingId === c.id;

    return (
      <div
        key={c.id}
        onClick={() => {
          setActiveConversationId(c.id);
          setSidebarOpen(false);
        }}
        className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition select-none ${
          isActive
            ? "bg-[#ecf2ff] text-[#5d87ff] border-l-2 border-[#5d87ff]"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <Globe size={13} className="shrink-0 text-slate-400" />
          
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
              className="w-full bg-white border border-slate-200 px-1 py-0.5 rounded outline-none text-slate-800 text-[11px]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate flex-1">{c.title}</span>
          )}
        </div>

        {/* Sidebar buttons */}
        {!isRenaming && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 bg-transparent">
            <button
              onClick={(e) => togglePinConversation(c.id, e)}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition"
              title={c.pinned ? "Désancrer" : "Ancrer"}
            >
              <Pin size={10} className={c.pinned ? "fill-current text-[#5d87ff] rotate-45" : "rotate-45"} />
            </button>
            <button
              onClick={(e) => startRename(c.id, c.title, e)}
              className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition"
              title="Renommer"
            >
              <Edit3 size={10} />
            </button>
            <button
              onClick={(e) => deleteConversation(c.id, e)}
              className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-500 transition"
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

