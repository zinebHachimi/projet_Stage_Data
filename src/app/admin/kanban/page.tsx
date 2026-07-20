"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { AdminCard } from "@/components/admin/AdminShell";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Calendar,
  Flag,
  MessageSquare,
  CheckSquare,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

type Card = {
  id: string;
  columnId: string;
  title: string;
  description?: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  imageUrl?: string | null;
  dueDate?: string | null;
};

type Column = {
  id: string;
  title: string;
  cards: Card[];
};

type CardMeta = {
  assignee?: { name: string; initials: string; color: string };
  labels?: string[];
  comments?: Array<{ id: string; user: string; text: string; date: string }>;
  subtasks?: Array<{ id: string; text: string; done: boolean }>;
};

const MOCK_ASSIGNEES = [
  { name: "Zineb Hachimi", initials: "ZH", color: "bg-emerald-500 text-white" },
  { name: "John Doe", initials: "JD", color: "bg-blue-500 text-white" },
  { name: "Alice Smith", initials: "AS", color: "bg-purple-500 text-white" },
  { name: "Bob Johnson", initials: "BJ", color: "bg-amber-500 text-white" },
];

const AVAILABLE_LABELS = ["Feature", "Bug", "Design", "Marketing", "Research"];

const PRIORITY_FLAGS: Record<string, { color: string; label: string }> = {
  LOW: { color: "text-emerald-500 bg-emerald-50 border-emerald-200", label: "Basse" },
  MEDIUM: { color: "text-amber-500 bg-amber-50 border-amber-200", label: "Moyenne" },
  HIGH: { color: "text-rose-500 bg-rose-50 border-rose-200", label: "Haute" },
};

export default function AdminKanbanPage() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Filter & Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [dueDateFilter, setDueDateFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<string>("default");

  // Interaction states
  const [collapsedCols, setCollapsedCols] = useState<string[]>([]);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverColId, setDragOverColId] = useState<string | null>(null);

  // Modal states
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Card Meta local persistence (stored in localStorage by cardId)
  const [cardMetas, setCardMetas] = useState<Record<string, CardMeta>>({});

  // Creation form states
  const [createColId, setCreateColId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [formDueDate, setFormDueDate] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formAssignee, setFormAssignee] = useState("");
  const [formLabels, setFormLabels] = useState<string[]>([]);

  // Task detail sub-actions states
  const [newComment, setNewComment] = useState("");
  const [newSubtask, setNewSubtask] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/kanban", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to load board");
      } else {
        setColumns(data);
        
        // Load metadata from localStorage
        const storedMetas = localStorage.getItem("kanban_cards_metadata");
        if (storedMetas) {
          try {
            setCardMetas(JSON.parse(storedMetas));
          } catch {}
        }
      }
    } catch {
      setError("Failed to fetch Kanban board");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // Save metas to localStorage helper
  function saveCardMeta(cardId: string, newMeta: CardMeta) {
    setCardMetas((prev) => {
      const next = { ...prev, [cardId]: newMeta };
      localStorage.setItem("kanban_cards_metadata", JSON.stringify(next));
      return next;
    });
  }

  // Create card
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!createColId) {
      setError("Veuillez sélectionner une colonne.");
      return;
    }

    const payload = {
      columnId: createColId,
      title: formTitle,
      description: formDesc,
      priority: formPriority,
      dueDate: formDueDate ? new Date(formDueDate).toISOString() : null,
      imageUrl: formImageUrl || null,
    };

    try {
      const res = await fetch("/api/admin/kanban/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to create card");
      } else {
        // Save initial metadata for assignee & labels if set
        const meta: CardMeta = {};
        if (formAssignee) {
          const assigneeObj = MOCK_ASSIGNEES.find((a) => a.name === formAssignee);
          if (assigneeObj) meta.assignee = assigneeObj;
        }
        if (formLabels.length > 0) {
          meta.labels = formLabels;
        }
        meta.comments = [];
        meta.subtasks = [];
        saveCardMeta(data.id, meta);

        resetForm();
        setIsCreateModalOpen(false);
        void load();
      }
    } catch {
      setError("Failed to connect to API.");
    }
  }

  // Update card details
  async function updateCard(cardId: string, updatedFields: Partial<Card>, customMeta?: CardMeta) {
    const payload = {
      title: updatedFields.title,
      description: updatedFields.description,
      priority: updatedFields.priority,
      dueDate: updatedFields.dueDate ? new Date(updatedFields.dueDate).toISOString() : null,
      imageUrl: updatedFields.imageUrl,
      columnId: updatedFields.columnId,
    };

    try {
      const res = await fetch(`/api/admin/kanban/cards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (customMeta) {
          saveCardMeta(cardId, customMeta);
        }
        void load();
      }
    } catch {
      setError("Failed to update card.");
    }
  }

  // Delete card
  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/kanban/cards/${id}`, { method: "DELETE" });
      if (res.ok) {
        setIsDetailModalOpen(false);
        void load();
      }
    } catch {
      setError("Failed to delete card.");
    }
  }

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.setData("cardId", cardId);
  };

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOverColId(colId);
  };

  const handleDrop = async (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId") || draggedCardId;
    if (!cardId) return;

    // Optimistically update column position locally first
    let movedCard: Card | null = null;
    const nextColumns = columns.map((col) => {
      const card = col.cards.find((c) => c.id === cardId);
      if (card) {
        movedCard = { ...card, columnId: targetColId };
        return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
      }
      return col;
    });

    if (movedCard) {
      const updatedColumns = nextColumns.map((col) => {
        if (col.id === targetColId) {
          return { ...col, cards: [...col.cards, movedCard!] };
        }
        return col;
      });
      setColumns(updatedColumns);
      
      try {
        await fetch(`/api/admin/kanban/cards/${cardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ columnId: targetColId }),
        });
      } catch {
        setError("Failed to update column in DB, rolling back...");
        void load();
      }
    }
    
    setDraggedCardId(null);
    setDragOverColId(null);
  };

  // Card filter evaluation
  function getFilteredCards(cards: Card[]) {
    return cards
      .filter((card) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          card.title.toLowerCase().includes(query) ||
          (card.description && card.description.toLowerCase().includes(query));

        const matchesPriority = priorityFilter === "ALL" || card.priority === priorityFilter;

        // Due date filters
        let matchesDueDate = true;
        if (dueDateFilter !== "ALL" && card.dueDate) {
          const due = new Date(card.dueDate);
          const now = new Date();
          const oneWeek = 7 * 24 * 60 * 60 * 1000;
          if (dueDateFilter === "OVERDUE") {
            matchesDueDate = due < now && due.toDateString() !== now.toDateString();
          } else if (dueDateFilter === "TODAY") {
            matchesDueDate = due.toDateString() === now.toDateString();
          } else if (dueDateFilter === "WEEK") {
            matchesDueDate = due.getTime() - now.getTime() < oneWeek && due.getTime() > now.getTime();
          }
        } else if (dueDateFilter === "OVERDUE" && !card.dueDate) {
          matchesDueDate = false;
        }

        return matchesQuery && matchesPriority && matchesDueDate;
      })
      .sort((a, b) => {
        if (sortBy === "priority") {
          const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return order[b.priority] - order[a.priority];
        }
        if (sortBy === "dueDate") {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === "alphabetical") {
          return a.title.localeCompare(b.title);
        }
        return 0; // default order returned from DB
      });
  }

  // Collapsing columns logic
  const toggleCollapseCol = (colId: string) => {
    setCollapsedCols((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  // Card details modal actions
  const openDetailModal = (card: Card) => {
    setSelectedCard(card);
    setFormTitle(card.title);
    setFormDesc(card.description || "");
    setFormPriority(card.priority);
    setFormDueDate(card.dueDate ? card.dueDate.slice(0, 10) : "");
    setFormImageUrl(card.imageUrl || "");
    
    const meta = cardMetas[card.id] || {};
    setFormAssignee(meta.assignee?.name || "");
    setFormLabels(meta.labels || []);
    
    setIsEditMode(false);
    setIsDetailModalOpen(true);
  };

  const handleSaveCardEdit = () => {
    if (!selectedCard) return;
    
    const assigneeObj = MOCK_ASSIGNEES.find((a) => a.name === formAssignee);
    const updatedMeta: CardMeta = {
      ...(cardMetas[selectedCard.id] || {}),
      assignee: assigneeObj || undefined,
      labels: formLabels,
    };

    void updateCard(
      selectedCard.id,
      {
        title: formTitle,
        description: formDesc,
        priority: formPriority,
        dueDate: formDueDate || null,
        imageUrl: formImageUrl || null,
      },
      updatedMeta
    );

    setIsDetailModalOpen(false);
  };

  // Comments and Checklist subtasks
  const handleAddComment = () => {
    if (!selectedCard || !newComment.trim()) return;
    const currentMeta = cardMetas[selectedCard.id] || {};
    const commentsList = currentMeta.comments || [];
    
    const comment = {
      id: `comment-${Date.now()}`,
      user: "Zineb Hachimi",
      text: newComment,
      date: new Date().toLocaleString(),
    };

    const nextMeta = {
      ...currentMeta,
      comments: [comment, ...commentsList],
    };
    saveCardMeta(selectedCard.id, nextMeta);
    setNewComment("");
  };

  const handleAddSubtask = () => {
    if (!selectedCard || !newSubtask.trim()) return;
    const currentMeta = cardMetas[selectedCard.id] || {};
    const tasks = currentMeta.subtasks || [];

    const task = {
      id: `subtask-${Date.now()}`,
      text: newSubtask,
      done: false,
    };

    const nextMeta = {
      ...currentMeta,
      subtasks: [...tasks, task],
    };
    saveCardMeta(selectedCard.id, nextMeta);
    setNewSubtask("");
  };

  const toggleSubtask = (taskId: string) => {
    if (!selectedCard) return;
    const currentMeta = cardMetas[selectedCard.id] || {};
    const tasks = currentMeta.subtasks || [];
    
    const nextMeta = {
      ...currentMeta,
      subtasks: tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    };
    saveCardMeta(selectedCard.id, nextMeta);
  };

  const deleteSubtask = (taskId: string) => {
    if (!selectedCard) return;
    const currentMeta = cardMetas[selectedCard.id] || {};
    const tasks = currentMeta.subtasks || [];

    const nextMeta = {
      ...currentMeta,
      subtasks: tasks.filter((t) => t.id !== taskId),
    };
    saveCardMeta(selectedCard.id, nextMeta);
  };

  function toggleFormLabel(label: string) {
    setFormLabels((current) =>
      current.includes(label) ? current.filter((l) => l !== label) : [...current, label]
    );
  }

  function resetForm() {
    setFormTitle("");
    setFormDesc("");
    setFormPriority("MEDIUM");
    setFormDueDate("");
    setFormImageUrl("");
    setFormAssignee("");
    setFormLabels([]);
    setError("");
  }

  // Get color warning for card due dates
  function getDueDateBadge(dueDate: string | null | undefined) {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    const isOverdue = due < now && due.toDateString() !== now.toDateString();
    const isTodayDate = due.toDateString() === now.toDateString();
    
    let style = "bg-slate-50 text-slate-500 border-slate-200";
    if (isOverdue) style = "bg-rose-50 text-rose-600 border-rose-200 animate-pulse";
    else if (isTodayDate) style = "bg-amber-50 text-amber-600 border-amber-200";
    else if (due.getTime() - now.getTime() < oneWeek) style = "bg-blue-50 text-blue-600 border-blue-200";

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${style}`}>
        <Calendar size={10} />
        {due.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-up {
          animation: scaleUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Control panel: filter, search and sort */}
      <AdminCard className="flex flex-col xl:flex-row items-center justify-between gap-4 p-6 rounded-xl shadow-sm bg-white">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <Search size={15} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher des cartes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-[#dfe5ef] pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none focus:border-[#5d87ff] focus:bg-white transition"
            />
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 w-full md:w-auto bg-slate-50 border border-[#dfe5ef] rounded-xl px-3 py-1.5">
            <SlidersHorizontal size={14} className="text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les priorités</option>
              <option value="HIGH">Haute</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LOW">Basse</option>
            </select>
          </div>

          {/* Date filter */}
          <div className="flex items-center gap-2 w-full md:w-auto bg-slate-50 border border-[#dfe5ef] rounded-xl px-3 py-1.5">
            <Calendar size={14} className="text-slate-400" />
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer"
            >
              <option value="ALL">Toutes les échéances</option>
              <option value="OVERDUE">En retard</option>
              <option value="TODAY">Aujourd&apos;hui</option>
              <option value="WEEK">Cette semaine</option>
            </select>
          </div>
        </div>

        {/* Sorting & Add new Card */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 bg-slate-50 border border-[#dfe5ef] rounded-xl px-3 py-1.5">
            <ArrowUpDown size={14} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-600 outline-none cursor-pointer"
            >
              <option value="default">Tri par défaut</option>
              <option value="priority">Priorité : Haute à Basse</option>
              <option value="dueDate">Échéance la plus proche</option>
              <option value="alphabetical">Titre : A-Z</option>
            </select>
          </div>

          <button
            onClick={() => {
              resetForm();
              if (columns.length > 0) setCreateColId(columns[0].id);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1 bg-[#5d87ff] hover:bg-[#4b73df] px-4.5 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition"
          >
            <Plus size={15} />
            Ajouter une carte
          </button>
        </div>
      </AdminCard>

      {error && (
        <div className="rounded-xl bg-rose-50 p-4 text-xs text-rose-500 border border-rose-100 flex items-center justify-between shadow-sm">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold hover:opacity-85">
            ✕
          </button>
        </div>
      )}

      {/* Board columns layout */}
      <div className="flex gap-6 overflow-x-auto pb-4 items-start select-none min-h-[500px]">
        {loading ? (
          <div className="flex-1 flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#5d87ff] border-r-transparent" />
              <p className="mt-2 text-xs font-semibold text-[#5a6a85bf]">Chargement du tableau...</p>
            </div>
          </div>
        ) : columns.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-12 flex-1">Tableau Kanban vide.</p>
        ) : (
          columns.map((column) => {
            const isCollapsed = collapsedCols.includes(column.id);
            const displayCards = getFilteredCards(column.cards);
            const isDragOver = dragOverColId === column.id;

            if (isCollapsed) {
              /* Collapsed column bar */
              return (
                <div
                  key={column.id}
                  onClick={() => toggleCollapseCol(column.id)}
                  className="w-12 bg-white border border-[#dfe5ef] py-6 px-1 rounded-xl shadow-sm flex flex-col items-center justify-between cursor-pointer hover:bg-slate-50 transition shrink-0 self-stretch min-h-[450px]"
                >
                  <button className="p-1 rounded-lg hover:bg-slate-200 text-slate-500">
                    <ChevronRight size={14} />
                  </button>
                  <h3 className="text-xs font-bold text-slate-600 uppercase vertical-text origin-center select-none py-4 w-[20px] text-center truncate">
                    {column.title}
                  </h3>
                  <span className="bg-slate-100 text-slate-600 rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold">
                    {column.cards.length}
                  </span>
                </div>
              );
            }

            return (
              /* Expanded column container */
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`w-[300px] shrink-0 flex flex-col gap-4 rounded-xl p-4 bg-slate-50 border transition-all duration-200 min-h-[450px] ${
                  isDragOver ? "border-[#5d87ff] bg-[#5d87ff]/5" : "border-[#dfe5ef]"
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-800 truncate select-none">{column.title}</h3>
                    <span className="bg-[#ecf2ff] text-[#5d87ff] px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                      {column.cards.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => {
                        resetForm();
                        setCreateColId(column.id);
                        setIsCreateModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition"
                      title="Ajouter une carte"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => toggleCollapseCol(column.id)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition"
                      title="Réduire la colonne"
                    >
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[700px] pr-0.5">
                  {displayCards.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400 bg-white">
                      Aucune carte
                    </div>
                  ) : (
                    displayCards.map((card) => {
                      const meta = cardMetas[card.id] || {};
                      const subtaskCount = meta.subtasks?.length || 0;
                      const doneCount = meta.subtasks?.filter((t) => t.done).length || 0;
                      const progressPercent = subtaskCount > 0 ? (doneCount / subtaskCount) * 100 : 0;

                      return (
                        <article
                          key={card.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id)}
                          onClick={() => openDetailModal(card)}
                          className="group bg-white border border-[#dfe5ef] p-4 rounded-xl shadow-sm hover:shadow-md hover:border-[#5d87ff]/40 transition duration-200 cursor-grab active:cursor-grabbing relative flex flex-col gap-3 select-none"
                        >
                          {card.imageUrl && (
                            <div className="relative h-28 w-full -mx-4 -mt-4 overflow-hidden rounded-t-xl bg-slate-100">
                              <Image
                                src={card.imageUrl}
                                fill
                                alt="Banner"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}

                          <div>
                            <h4 className="text-xs font-bold text-slate-800 leading-snug truncate">
                              {card.title}
                            </h4>
                            {card.description && (
                              <p className="text-[11px] text-[#5a6a85bf] line-clamp-2 mt-1 truncate">
                                {card.description}
                              </p>
                            )}
                          </div>

                          {/* Progress Checklist bar */}
                          {subtaskCount > 0 && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400">
                                <span>Tâches</span>
                                <span>{doneCount}/{subtaskCount}</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-500 h-full transition-all duration-300"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Bottom metadata badges */}
                          <div className="flex items-center justify-between border-t border-slate-50 pt-2 gap-2 flex-wrap">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {/* Priority flag */}
                              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                                PRIORITY_FLAGS[card.priority]?.color
                              }`}>
                                <Flag size={9} fill="currentColor" />
                                {PRIORITY_FLAGS[card.priority]?.label}
                              </span>

                              {/* Due date status */}
                              {getDueDateBadge(card.dueDate)}
                            </div>

                            {/* Assignee Avatar */}
                            {meta.assignee && (
                              <div
                                className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm border border-white ${meta.assignee.color}`}
                                title={meta.assignee.name}
                              >
                                {meta.assignee.initials}
                              </div>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE CARD DIALOG */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-scale-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#dfe5ef] p-6 max-h-[90vh] overflow-y-auto chat-scroll">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <SlidersHorizontal size={18} className="text-[#5d87ff]" />
                Ajouter une tâche
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Colonne</label>
                <select
                  value={createColId}
                  onChange={(e) => setCreateColId(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-medium"
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Titre</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="Nom de la tâche"
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Priorité</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                    className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-semibold"
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Échéance</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">URL de l&apos;image</label>
                <input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Assigner à</label>
                <select
                  value={formAssignee}
                  onChange={(e) => setFormAssignee(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-medium"
                >
                  <option value="">Non assigné</option>
                  {MOCK_ASSIGNEES.map((a) => (
                    <option key={a.name} value={a.name}>{a.name}</option>
                  ))}
                </select>
              </div>

              {/* Labels Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Tags / Étiquettes</label>
                <div className="flex flex-wrap gap-1">
                  {AVAILABLE_LABELS.map((label) => {
                    const isSelected = formLabels.includes(label);
                    return (
                      <button
                        type="button"
                        key={label}
                        onClick={() => toggleFormLabel(label)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                          isSelected
                            ? "bg-[#ecf2ff] border-[#5d87ff] text-[#5d87ff]"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Détaillez la tâche..."
                  className="w-full min-h-20 rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED CARD / TASK MODAL */}
      {isDetailModalOpen && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-scale-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-[#dfe5ef] p-6 max-h-[90vh] overflow-y-auto chat-scroll flex flex-col md:flex-row gap-6 relative">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={18} />
            </button>

            {/* Left section: main details, checklist & activity */}
            <div className="flex-1 space-y-5">
              {isEditMode ? (
                /* EDIT DETAILS FORM */
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Edit3 size={16} /> Modifier la tâche
                  </h3>
                  
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Titre</label>
                    <input
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Priorité</label>
                      <select
                        value={formPriority}
                        onChange={(e) => setFormPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                        className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-semibold"
                      >
                        <option value="LOW">Basse</option>
                        <option value="MEDIUM">Moyenne</option>
                        <option value="HIGH">Haute</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Échéance</label>
                      <input
                        type="date"
                        value={formDueDate}
                        onChange={(e) => setFormDueDate(e.target.value)}
                        className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">URL de l&apos;image</label>
                    <input
                      value={formImageUrl}
                      onChange={(e) => setFormImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Assigner à</label>
                    <select
                      value={formAssignee}
                      onChange={(e) => setFormAssignee(e.target.value)}
                      className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-medium"
                    >
                      <option value="">Non assigné</option>
                      {MOCK_ASSIGNEES.map((a) => (
                        <option key={a.name} value={a.name}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="w-full min-h-20 rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                    >
                      Retour
                    </button>
                    <button
                      onClick={handleSaveCardEdit}
                      className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition"
                    >
                      Sauvegarder
                    </button>
                  </div>
                </div>
              ) : (
                /* VIEW DETAILS / CHECKLIST / COMMENTS */
                <>
                  <div>
                    <h3 className="text-base font-bold text-slate-800 select-text leading-snug">{selectedCard.title}</h3>
                    {selectedCard.description && (
                      <p className="text-xs text-slate-600 mt-2 select-text whitespace-pre-wrap">{selectedCard.description}</p>
                    )}
                  </div>

                  {/* Checklist Subtasks */}
                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5 select-none">
                      <CheckSquare size={13} />
                      Sous-tâches Checklist
                    </h4>
                    
                    <div className="space-y-2">
                      {(cardMetas[selectedCard.id]?.subtasks || []).map((t) => (
                        <div key={t.id} className="flex items-center justify-between gap-2 bg-slate-50 p-2 rounded-lg text-xs font-medium">
                          <label className="flex items-center gap-2 flex-1 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={t.done}
                              onChange={() => toggleSubtask(t.id)}
                              className="h-4 w-4 rounded border-slate-300 text-[#5d87ff] focus:ring-[#5d87ff]"
                            />
                            <span className={t.done ? "line-through text-slate-400" : "text-slate-700"}>
                              {t.text}
                            </span>
                          </label>
                          <button
                            onClick={() => deleteSubtask(t.id)}
                            className="text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ajouter une sous-tâche..."
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSubtask();
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#5d87ff] focus:bg-white"
                      />
                      <button
                        onClick={handleAddSubtask}
                        className="bg-[#5d87ff] hover:bg-[#4b73df] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Activity and Comments Section */}
                  <div className="space-y-3 border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5 select-none">
                      <MessageSquare size={13} />
                      Commentaires & Activités
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Écrire un commentaire..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none focus:border-[#5d87ff] focus:bg-white"
                      />
                      <button
                        onClick={handleAddComment}
                        className="bg-[#5d87ff] hover:bg-[#4b73df] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        Publier
                      </button>
                    </div>

                    <div className="space-y-3 max-h-48 overflow-y-auto chat-scroll pr-1 mt-2">
                      {(cardMetas[selectedCard.id]?.comments || []).map((cmt) => (
                        <div key={cmt.id} className="bg-slate-50 border border-slate-100/50 p-2.5 rounded-xl text-xs space-y-1 animate-scale-up">
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                            <span>{cmt.user}</span>
                            <span>{cmt.date}</span>
                          </div>
                          <p className="text-slate-700 select-text leading-relaxed">{cmt.text}</p>
                        </div>
                      ))}
                      {(cardMetas[selectedCard.id]?.comments || []).length === 0 && (
                        <p className="text-center text-[11px] text-slate-400 py-3">Aucun commentaire pour le moment.</p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right section: metadata cards & sidebar actions */}
            <div className="w-full md:w-48 shrink-0 space-y-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase select-none">Propriétés</h4>

              <div className="space-y-3 text-xs">
                {/* Assignee display */}
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Assigné</span>
                  {cardMetas[selectedCard.id]?.assignee ? (
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        cardMetas[selectedCard.id].assignee!.color
                      }`}>
                        {cardMetas[selectedCard.id].assignee!.initials}
                      </div>
                      <span className="font-semibold text-slate-700 truncate">
                        {cardMetas[selectedCard.id].assignee!.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Non assigné</span>
                  )}
                </div>

                {/* Priority display */}
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Priorité</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold ${
                    PRIORITY_FLAGS[selectedCard.priority]?.color
                  }`}>
                    <Flag size={9} fill="currentColor" />
                    {PRIORITY_FLAGS[selectedCard.priority]?.label}
                  </span>
                </div>

                {/* Due Date display */}
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Échéance</span>
                  {selectedCard.dueDate ? (
                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      {new Date(selectedCard.dueDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Pas d&apos;échéance</span>
                  )}
                </div>

                {/* Labels display */}
                {cardMetas[selectedCard.id]?.labels && cardMetas[selectedCard.id].labels!.length > 0 && (
                  <div>
                    <span className="block text-slate-400 text-[10px] font-bold uppercase mb-1">Étiquettes</span>
                    <div className="flex flex-wrap gap-1">
                      {cardMetas[selectedCard.id].labels!.map((l) => (
                        <span key={l} className="bg-slate-100 text-slate-600 border border-slate-200 rounded px-1.5 py-0.5 text-[9px] font-bold">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar actions: Edit, Delete, Close */}
              {!isEditMode && (
                <div className="flex flex-col gap-2 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center justify-center gap-1.5 w-full bg-slate-50 hover:bg-slate-200 border border-slate-200 text-slate-600 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <Edit3 size={13} />
                    Modifier détails
                  </button>
                  <button
                    onClick={() => void remove(selectedCard.id)}
                    className="flex items-center justify-center gap-1.5 w-full bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 py-2 rounded-xl text-xs font-bold transition"
                  >
                    <Trash2 size={13} />
                    Supprimer carte
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
