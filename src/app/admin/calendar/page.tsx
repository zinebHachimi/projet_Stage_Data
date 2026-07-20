"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminCard } from "@/components/admin/AdminShell";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Tag,
  Copy,
  Edit2,
  X,
} from "lucide-react";

type EventItem = {
  id: string;
  title: string;
  description?: string | null;
  startsAt: string;
  endsAt: string;
  location?: string | null;
  color?: string;
};

type CalendarView = "month" | "week" | "day";

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  primary: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "Général" },
  danger: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Haute Priorité" },
  warning: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Moyenne Priorité" },
  success: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", label: "Basse Priorité" },
  info: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", label: "Personnel" },
};

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Navigation states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  
  // Selected Event & Modal states
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form local state (for creation & inline edit)
  const [formTitle, setFormTitle] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStartsAt, setFormStartsAt] = useState("");
  const [formEndsAt, setFormEndsAt] = useState("");
  const [formColor, setFormColor] = useState("primary");

  // Drag and drop state
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/calendar", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to load events");
      } else {
        setEvents(data);
      }
    } catch {
      setError("Failed to fetch calendar events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  // Form submit (create event)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (new Date(formEndsAt) <= new Date(formStartsAt)) {
      setError("La date de fin doit être postérieure à la date de début.");
      return;
    }

    const payload = {
      title: formTitle,
      location: formLocation,
      description: formDescription,
      startsAt: new Date(formStartsAt).toISOString(),
      endsAt: new Date(formEndsAt).toISOString(),
      color: formColor,
    };

    try {
      const res = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to save event");
      } else {
        setEvents((current) => [...current, data].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
        resetForm();
        setIsCreateModalOpen(false);
      }
    } catch {
      setError("Network error when creating event.");
    }
  }

  // Update calendar event (via Drag/Drop or Edit Modal)
  async function updateEvent(id: string, updatedFields: Partial<EventItem>) {
    setError("");
    const target = events.find((e) => e.id === id);
    if (!target) return;

    const payload = {
      title: updatedFields.title ?? target.title,
      location: updatedFields.location ?? target.location,
      description: updatedFields.description ?? target.description,
      startsAt: updatedFields.startsAt ?? target.startsAt,
      endsAt: updatedFields.endsAt ?? target.endsAt,
      color: updatedFields.color ?? target.color ?? "primary",
    };

    if (new Date(payload.endsAt) <= new Date(payload.startsAt)) {
      setError("La date de fin doit être après le début.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/calendar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to update event");
      } else {
        setEvents((current) =>
          current.map((item) => (item.id === id ? data : item)).sort((a, b) => a.startsAt.localeCompare(b.startsAt))
        );
      }
    } catch {
      setError("Failed to update event.");
    }
  }

  // Delete event
  async function remove(id: string) {
    try {
      await fetch(`/api/admin/calendar/${id}`, { method: "DELETE" });
      setEvents((current) => current.filter((item) => item.id !== id));
      setIsDetailModalOpen(false);
    } catch {
      setError("Failed to delete event.");
    }
  }

  // Duplicate event
  async function duplicate(item: EventItem) {
    const payload = {
      title: `${item.title} (Copie)`,
      location: item.location,
      description: item.description,
      startsAt: item.startsAt,
      endsAt: item.endsAt,
      color: item.color || "primary",
    };

    try {
      const res = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((current) => [...current, data].sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
        setIsDetailModalOpen(false);
      }
    } catch {
      setError("Failed to duplicate event.");
    }
  }

  // Helper: Open create dialog on specific date click
  function handleDayClick(date: Date) {
    const startStr = date.toISOString().slice(0, 16);
    // End date defaults to 1 hour later
    const endDate = new Date(date.getTime() + 60 * 60 * 1000);
    const endStr = endDate.toISOString().slice(0, 16);

    setFormStartsAt(startStr);
    setFormEndsAt(endStr);
    setIsCreateModalOpen(true);
  }

  function openDetailModal(eventItem: EventItem) {
    setSelectedEvent(eventItem);
    setFormTitle(eventItem.title);
    setFormLocation(eventItem.location || "");
    setFormDescription(eventItem.description || "");
    setFormStartsAt(new Date(eventItem.startsAt).toISOString().slice(0, 16));
    setFormEndsAt(new Date(eventItem.endsAt).toISOString().slice(0, 16));
    setFormColor(eventItem.color || "primary");
    setIsEditMode(false);
    setIsDetailModalOpen(true);
  }

  function handleSaveEdit() {
    if (!selectedEvent) return;
    void updateEvent(selectedEvent.id, {
      title: formTitle,
      location: formLocation,
      description: formDescription,
      startsAt: new Date(formStartsAt).toISOString(),
      endsAt: new Date(formEndsAt).toISOString(),
      color: formColor,
    });
    setIsDetailModalOpen(false);
  }

  function resetForm() {
    setFormTitle("");
    setFormLocation("");
    setFormDescription("");
    setFormStartsAt("");
    setFormEndsAt("");
    setFormColor("primary");
    setError("");
  }

  // Date Navigation utils
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  function next() {
    if (currentView === "month") {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (currentView === "week") {
      setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000));
    }
  }

  function prev() {
    if (currentView === "month") {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (currentView === "week") {
      setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000));
    } else {
      setCurrentDate(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000));
    }
  }

  function today() {
    setCurrentDate(new Date());
  }

  // Calendar Math Helpers
  // Month calculation (42 cells grid)
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayIndex = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay(); // 0 is Sunday
    return day;
  };

  const daysOfGrid: Date[] = [];
  const daysInCurMonth = getDaysInMonth(year, month);
  const firstDayIdx = getFirstDayIndex(year, month);
  
  // Padding from previous month
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDayIdx - 1; i >= 0; i--) {
    daysOfGrid.push(new Date(year, month - 1, prevMonthDays - i));
  }
  // Days of active month
  for (let i = 1; i <= daysInCurMonth; i++) {
    daysOfGrid.push(new Date(year, month, i));
  }
  // Padding from next month
  const cellsLeft = 42 - daysOfGrid.length;
  for (let i = 1; i <= cellsLeft; i++) {
    daysOfGrid.push(new Date(year, month + 1, i));
  }

  // Week calculation (7 days)
  const getWeekDays = (date: Date): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const startOfWeek = new Date(date.setDate(diff));
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(startOfWeek.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return days;
  };
  const weekDaysList = getWeekDays(new Date(currentDate));

  // Date comparers
  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isToday = (date: Date) => isSameDay(date, new Date());

  // Filter events of a specific day
  const getEventsForDay = (date: Date) =>
    events.filter((item) => {
      const d = new Date(item.startsAt);
      return isSameDay(d, date);
    });

  // Drag & drop handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    setDraggedEventId(eventId);
    e.dataTransfer.setData("text/plain", eventId);
  };

  const handleDropDay = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (!draggedEventId) return;

    const draggedEvent = events.find((evt) => evt.id === draggedEventId);
    if (!draggedEvent) return;

    // Shift start & end dates by keeping duration exact
    const start = new Date(draggedEvent.startsAt);
    const end = new Date(draggedEvent.endsAt);
    const duration = end.getTime() - start.getTime();

    const newStart = new Date(targetDate);
    newStart.setHours(start.getHours(), start.getMinutes(), 0, 0);
    const newEnd = new Date(newStart.getTime() + duration);

    void updateEvent(draggedEventId, {
      startsAt: newStart.toISOString(),
      endsAt: newEnd.toISOString(),
    });
    setDraggedEventId(null);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-12 gap-6 relative">
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>

      {/* Header Panel */}
      <div className="col-span-12 flex flex-col md:flex-row items-center justify-between border-b border-[#dfe5ef] pb-4 gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecf2ff] text-[#5d87ff]">
            <CalendarIcon size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {currentDate.toLocaleString("fr-FR", { month: "long", year: "numeric" })}
            </h2>
            <p className="text-xs text-[#5a6a85bf]">Planification d&apos;évènements et suivi</p>
          </div>
        </div>

        {/* View switching */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setCurrentView("month")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              currentView === "month" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setCurrentView("week")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              currentView === "week" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setCurrentView("day")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              currentView === "day" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Jour
          </button>
        </div>

        {/* Navigation & Add buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-[#dfe5ef] rounded-xl bg-white p-0.5">
            <button onClick={prev} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition">
              <ChevronLeft size={16} />
            </button>
            <button onClick={today} className="px-3.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition border-x border-[#dfe5ef]">
              Aujourd&apos;hui
            </button>
            <button onClick={next} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition">
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              resetForm();
              const now = new Date();
              setFormStartsAt(now.toISOString().slice(0, 16));
              setFormEndsAt(new Date(now.getTime() + 3600000).toISOString().slice(0, 16));
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-[#5d87ff] hover:bg-[#4b73df] px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition"
          >
            <Plus size={16} />
            Créer
          </button>
        </div>
      </div>

      {error && (
        <div className="col-span-12 rounded-xl bg-rose-50 p-4 text-xs text-rose-500 border border-rose-100 flex items-center justify-between shadow-sm animate-slide-up shrink-0">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold hover:opacity-85">
            ✕
          </button>
        </div>
      )}

      {/* Main Calendar Panel */}
      <AdminCard className="col-span-12 p-0 border border-[#dfe5ef] overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-[#5d87ff] border-r-transparent" />
              <p className="mt-2 text-xs font-semibold text-[#5a6a85bf]">Chargement du calendrier...</p>
            </div>
          </div>
        ) : (
          <div>
            {currentView === "month" && renderMonthView()}
            {currentView === "week" && renderWeekView()}
            {currentView === "day" && renderDayView()}
          </div>
        )}
      </AdminCard>

      {/* CREATE EVENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-slide-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#dfe5ef] p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon size={18} className="text-[#5d87ff]" />
                Créer un évènement
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
                <label className="text-xs font-bold text-slate-500 uppercase">Titre</label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="Réunion d'équipe, Démo..."
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Début</label>
                  <input
                    type="datetime-local"
                    value={formStartsAt}
                    onChange={(e) => setFormStartsAt(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Fin</label>
                  <input
                    type="datetime-local"
                    value={formEndsAt}
                    onChange={(e) => setFormEndsAt(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Emplacement</label>
                <input
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Bureau, Google Meet..."
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Catégorie / Priorité</label>
                <select
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                >
                  <option value="primary">Général (Bleu)</option>
                  <option value="danger">Urgent (Rouge)</option>
                  <option value="warning">Moyen (Orange)</option>
                  <option value="success">Faible (Vert)</option>
                  <option value="info">Personnel (Cyan)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Notes de réunion, objectifs..."
                  className="w-full min-h-20 rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition resize-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
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
                  Créer l&apos;évènement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT DETAIL & EDIT MODAL */}
      {isDetailModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-slide-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-[#dfe5ef] p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <Clock size={18} className="text-[#5d87ff]" />
                {isEditMode ? "Modifier l'évènement" : "Détails de l'évènement"}
              </h3>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {isEditMode ? (
              /* EDIT MODE */
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Titre</label>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Début</label>
                    <input
                      type="datetime-local"
                      value={formStartsAt}
                      onChange={(e) => setFormStartsAt(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Fin</label>
                    <input
                      type="datetime-local"
                      value={formEndsAt}
                      onChange={(e) => setFormEndsAt(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#dfe5ef] px-3 py-2 text-xs outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Emplacement</label>
                  <input
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Catégorie / Priorité</label>
                  <select
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                  >
                    <option value="primary">Général (Bleu)</option>
                    <option value="danger">Urgent (Rouge)</option>
                    <option value="warning">Moyen (Orange)</option>
                    <option value="success">Faible (Vert)</option>
                    <option value="info">Personnel (Cyan)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full min-h-20 rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            ) : (
              /* VIEW DETAIL MODE */
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    PRIORITY_COLORS[selectedEvent.color || "primary"]?.bg
                  } ${PRIORITY_COLORS[selectedEvent.color || "primary"]?.text} ${
                    PRIORITY_COLORS[selectedEvent.color || "primary"]?.border
                  }`}>
                    <Tag size={8} />
                    {PRIORITY_COLORS[selectedEvent.color || "primary"]?.label}
                  </span>
                  <h4 className="text-lg font-bold text-slate-800 mt-2 select-text">{selectedEvent.title}</h4>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock size={15} className="text-slate-400" />
                    <span className="select-text">
                      {new Date(selectedEvent.startsAt).toLocaleString("fr-FR", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(selectedEvent.endsAt).toLocaleString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={15} className="text-slate-400" />
                      <span className="select-text">{selectedEvent.location}</span>
                    </div>
                  )}
                </div>

                {selectedEvent.description && (
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Description</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap select-text">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="flex items-center gap-1 text-xs font-bold bg-[#ecf2ff] hover:bg-[#5d87ff] hover:text-white text-[#5d87ff] px-3.5 py-2 rounded-xl transition"
                    >
                      <Edit2 size={13} />
                      Modifier
                    </button>
                    <button
                      onClick={() => void duplicate(selectedEvent)}
                      className="flex items-center gap-1 text-xs font-bold bg-slate-50 hover:bg-slate-200 text-slate-600 px-3.5 py-2 rounded-xl transition border border-slate-200"
                    >
                      <Copy size={13} />
                      Dupliquer
                    </button>
                  </div>

                  <button
                    onClick={() => void remove(selectedEvent.id)}
                    className="flex items-center gap-1 text-xs font-bold bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 px-3.5 py-2 rounded-xl transition"
                  >
                    <Trash2 size={13} />
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Month View rendering
  function renderMonthView() {
    const WEEK_DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    return (
      <div className="w-full">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#dfe5ef] bg-slate-50/50 text-center py-2 text-xs font-bold text-slate-500 uppercase">
          {WEEK_DAYS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 grid-rows-6 border-b border-[#dfe5ef] bg-slate-100/50">
          {daysOfGrid.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = day.getMonth() === month;
            const isTodayDay = isToday(day);

            return (
              <div
                key={idx}
                onDragOver={allowDrop}
                onDrop={(e) => handleDropDay(e, day)}
                onClick={() => handleDayClick(day)}
                className={`min-h-[110px] bg-white border-r border-b border-[#dfe5ef] p-2 flex flex-col justify-between hover:bg-slate-50/40 transition group cursor-pointer ${
                  !isCurrentMonth ? "opacity-40" : ""
                }`}
              >
                {/* Day number */}
                <div className="flex justify-between items-center select-none">
                  <span
                    className={`h-6 w-6 flex items-center justify-center text-xs font-bold rounded-full ${
                      isTodayDay
                        ? "bg-[#5d87ff] text-white shadow-sm"
                        : "text-slate-700"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#5d87ff] font-bold">
                    + Événement
                  </span>
                </div>

                {/* Day events badges */}
                <div className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto max-h-16">
                  {dayEvents.slice(0, 3).map((item) => {
                    const colConfig = PRIORITY_COLORS[item.color || "primary"];
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailModal(item);
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border truncate cursor-grab active:cursor-grabbing hover:brightness-95 transition ${
                          colConfig.bg
                        } ${colConfig.text} ${colConfig.border}`}
                      >
                        {item.title}
                      </div>
                    );
                  })}
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] font-bold text-slate-400 pl-1 select-none">
                      +{dayEvents.length - 3} autres
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Week View rendering
  function renderWeekView() {
    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Days header */}
          <div className="grid grid-cols-8 border-b border-[#dfe5ef] bg-slate-50/50 py-2.5 text-center text-xs font-bold text-slate-500 uppercase">
            <div className="border-r border-[#dfe5ef]">Heures</div>
            {weekDaysList.map((day, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center ${
                  isToday(day) ? "text-[#5d87ff]" : "text-slate-600"
                }`}
              >
                <span>{day.toLocaleDateString("fr-FR", { weekday: "short" })}</span>
                <span className={`text-base font-bold h-6 w-6 flex items-center justify-center rounded-full mt-0.5 ${
                  isToday(day) ? "bg-[#5d87ff] text-white" : ""
                }`}>
                  {day.getDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Time lines */}
          <div className="relative">
            {/* Hour lines from 8 AM to 8 PM */}
            {Array.from({ length: 13 }).map((_, idx) => {
              const hour = idx + 8;
              return (
                <div key={idx} className="grid grid-cols-8 border-b border-[#dfe5ef]/70 h-16 relative group">
                  {/* Hour label */}
                  <div className="text-[10px] font-bold text-slate-400 flex items-center justify-center border-r border-[#dfe5ef] bg-slate-50/20 select-none">
                    {hour.toString().padStart(2, "0")}:00
                  </div>
                  
                  {/* Day columns */}
                  {Array.from({ length: 7 }).map((_, colIdx) => {
                    const cellDate = new Date(weekDaysList[colIdx]);
                    cellDate.setHours(hour, 0, 0, 0);
                    return (
                      <div
                        key={colIdx}
                        onDragOver={allowDrop}
                        onDrop={(e) => handleDropDay(e, cellDate)}
                        onClick={() => handleDayClick(cellDate)}
                        className="border-r border-[#dfe5ef]/40 relative group-hover:bg-slate-50/20 transition cursor-pointer"
                      />
                    );
                  })}
                </div>
              );
            })}

            {/* Positioned Event overlays */}
            {events.map((item) => {
              const start = new Date(item.startsAt);
              const end = new Date(item.endsAt);
              
              // Find matching column in week
              const colIdx = weekDaysList.findIndex((d) => isSameDay(d, start));
              if (colIdx === -1) return null;

              // Check if hours overlap active grid (8 AM to 8 PM)
              const startHour = start.getHours() + start.getMinutes() / 60;
              const endHour = end.getHours() + end.getMinutes() / 60;
              
              if (startHour > 20 || endHour < 8) return null;
              
              // Clamp visual render within grid
              const visualStart = Math.max(startHour, 8);
              const visualEnd = Math.min(endHour, 21);
              const durationHrs = visualEnd - visualStart;

              // Calculate positions (each hour row is 64px high)
              const top = (visualStart - 8) * 64 + 1;
              const height = durationHrs * 64 - 2;
              
              // Column width index + 1 (compensating for first hour column)
              const leftPercent = ((colIdx + 1) / 8) * 100;
              const widthPercent = (1 / 8) * 100;
              const colConfig = PRIORITY_COLORS[item.color || "primary"];

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => openDetailModal(item)}
                  style={{
                    position: "absolute",
                    top: `${top}px`,
                    left: `${leftPercent}%`,
                    width: `calc(${widthPercent}% - 6px)`,
                    height: `${height}px`,
                    margin: "0 3px",
                  }}
                  className={`rounded-xl border p-2 text-left cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-shadow overflow-hidden flex flex-col justify-between ${
                    colConfig.bg
                  } ${colConfig.text} ${colConfig.border}`}
                >
                  <div>
                    <h5 className="text-[11px] font-bold leading-tight truncate">{item.title}</h5>
                    <p className="text-[9px] font-medium opacity-85 mt-0.5 truncate">
                      {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {height > 40 && item.location && (
                    <span className="text-[8px] font-semibold flex items-center gap-0.5 mt-1 truncate">
                      <MapPin size={8} /> {item.location}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Day View rendering
  function renderDayView() {
    const day = currentDate;
    const dayEvents = getEventsForDay(day);

    return (
      <div className="w-full">
        {/* Header summary info */}
        <div className="bg-slate-50 border-b border-[#dfe5ef] p-4 text-center">
          <h4 className="text-sm font-bold text-slate-700">
            {day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          </h4>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            {dayEvents.length} évènement{dayEvents.length > 1 ? "s" : ""} programmé{dayEvents.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Time table */}
        <div className="relative">
          {Array.from({ length: 13 }).map((_, idx) => {
            const hour = idx + 8;
            const cellDate = new Date(day);
            cellDate.setHours(hour, 0, 0, 0);

            return (
              <div key={idx} className="grid grid-cols-12 border-b border-[#dfe5ef]/70 h-16 relative group">
                {/* Hour label */}
                <div className="col-span-2 text-[10px] font-bold text-slate-400 flex items-center justify-center border-r border-[#dfe5ef] bg-slate-50/20 select-none">
                  {hour.toString().padStart(2, "0")}:00
                </div>

                {/* Day cell */}
                <div
                  onDragOver={allowDrop}
                  onDrop={(e) => handleDropDay(e, cellDate)}
                  onClick={() => handleDayClick(cellDate)}
                  className="col-span-10 relative group-hover:bg-slate-50/10 transition cursor-pointer"
                />
              </div>
            );
          })}

          {/* Positioned Event overlays */}
          {dayEvents.map((item) => {
            const start = new Date(item.startsAt);
            const end = new Date(item.endsAt);

            const startHour = start.getHours() + start.getMinutes() / 60;
            const endHour = end.getHours() + end.getMinutes() / 60;

            if (startHour > 20 || endHour < 8) return null;

            const visualStart = Math.max(startHour, 8);
            const visualEnd = Math.min(endHour, 21);
            const durationHrs = visualEnd - visualStart;

            const top = (visualStart - 8) * 64 + 1;
            const height = durationHrs * 64 - 2;

            const leftPercent = (2 / 12) * 100;
            const widthPercent = (10 / 12) * 100;
            const colConfig = PRIORITY_COLORS[item.color || "primary"];

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onClick={() => openDetailModal(item)}
                style={{
                  position: "absolute",
                  top: `${top}px`,
                  left: `${leftPercent}%`,
                  width: `calc(${widthPercent}% - 12px)`,
                  height: `${height}px`,
                  margin: "0 6px",
                }}
                className={`rounded-xl border p-3 text-left cursor-grab active:cursor-grabbing shadow-sm hover:shadow transition-shadow overflow-hidden flex flex-col justify-between ${
                  colConfig.bg
                  } ${colConfig.text} ${colConfig.border}`}
              >
                <div>
                  <h5 className="text-xs font-bold leading-tight truncate">{item.title}</h5>
                  <p className="text-[10px] font-medium opacity-85 mt-0.5">
                    {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {item.description && height > 60 && (
                    <p className="text-[10px] opacity-80 mt-1 line-clamp-1 truncate">{item.description}</p>
                  )}
                </div>
                {item.location && (
                  <span className="text-[10px] font-semibold flex items-center gap-0.5 mt-1 truncate">
                    <MapPin size={10} /> {item.location}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
