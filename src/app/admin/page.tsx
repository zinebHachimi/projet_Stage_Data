"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminCard } from "@/components/admin/AdminShell";
import {
  Users,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Activity,
  UserPlus,
  FolderPlus,
  PlusCircle,
  TrendingUp,
  X,
  Database,
  Globe,
  SlidersHorizontal,
} from "lucide-react";

type DashboardOverviewData = {
  users: number;
  offers: number;
  queries: number;
  errors: number;
  events: number;
  cards: number;
  byCity: Array<{ city: string; _count: { city: number } }>;
  recentQueries: Array<{ id: string; prompt: string; status: string }>;
  recentOffers: unknown[];
};

export default function AdminHomePage() {
  const [dbData, setDbData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  // Quick Action Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Success Feedback Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("ANALYST");
  const [userEmail, setUserEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectProgress, setProjectProgress] = useState("0");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");

  // Load database live metrics
  useEffect(() => {
    async function fetchDbOverview() {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        if (res.ok) {
          setDbData(data);
        }
      } catch (err) {
        console.error("Failed to load live database overview metrics", err);
      } finally {
        setLoading(false);
      }
    }
    void fetchDbOverview();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Utilisateur "${userName}" créé avec succès (Démonstration)`);
    setIsUserModalOpen(false);
    setUserName("");
    setUserEmail("");
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Projet "${projectTitle}" initialisé avec succès (${projectProgress}%)`);
    setIsProjectModalOpen(false);
    setProjectTitle("");
    setProjectProgress("0");
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Tâche "${taskTitle}" assignée avec succès (Priorité: ${taskPriority})`);
    setIsTaskModalOpen(false);
    setTaskTitle("");
  };

  // Mock static data for SaaS presentation
  const mockStats = [
    { label: "Utilisateurs Totaux", value: "248", change: "+12%", desc: "vs mois dernier", icon: Users, color: "bg-blue-500" },
    { label: "Utilisateurs Actifs", value: "193", change: "+5%", desc: "temps réel", icon: Activity, color: "bg-emerald-500" },
    { label: "Projets Actifs", value: "18", change: "+2 aujourd'hui", desc: "en cours", icon: FolderKanban, color: "bg-indigo-500" },
    { label: "Tâches en Cours", value: "94", change: "-14 complétées", desc: "cette semaine", icon: ListTodo, color: "bg-amber-500" },
  ];

  const recentActivities = [
    { id: "act-1", text: "Nouvel utilisateur Zineb Hachimi créé", time: "Il y a 10 min", type: "user" },
    { id: "act-2", text: "Projet Alpha mis à jour par John Doe", time: "Il y a 1 heure", type: "project" },
    { id: "act-3", text: "Tâche d'intégration AI complétée", time: "Il y a 2 heures", type: "task" },
    { id: "act-4", text: "Nouvelle tâche assignée à Alice Smith", time: "Il y a 4 heures", type: "assignment" },
  ];

  const recentUsers = [
    { name: "Zineb Hachimi", email: "zineb@example.com", role: "Administrateur", status: "Actif", initials: "ZH", color: "bg-emerald-100 text-emerald-800" },
    { name: "John Doe", email: "john@example.com", role: "Éditeur", status: "Inactif", initials: "JD", color: "bg-amber-100 text-amber-800" },
    { name: "Alice Smith", email: "alice@example.com", role: "Analyste", status: "Actif", initials: "AS", color: "bg-emerald-100 text-emerald-800" },
    { name: "Bob Johnson", email: "bob@example.com", role: "Visiteur", status: "Hors-ligne", initials: "BJ", color: "bg-slate-100 text-slate-800" },
  ];

  const projectStatusList = [
    { name: "Projet Alpha", progress: 82, color: "bg-[#5d87ff]" },
    { name: "Projet Beta", progress: 56, color: "bg-amber-500" },
    { name: "Projet Gamma", progress: 94, color: "bg-emerald-500" },
  ];

  // SVG Ring Chart calculation (donut chart)
  // Completed = 45, In Progress = 28, Pending = 21 (Total = 94)
  const taskStats = [
    { label: "Terminées", count: 45, color: "#10b981", percent: 48 },
    { label: "En Cours", count: 28, color: "#5d87ff", percent: 30 },
    { label: "En Attente", count: 21, color: "#f59e0b", percent: 22 },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 relative">
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .toast-animate {
          animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-10 z-50 bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg border border-emerald-400 flex items-center gap-2 text-xs font-semibold toast-animate">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Welcome Message Card */}
      <AdminCard className="col-span-12 shadow-sm hover:shadow transition-shadow overflow-hidden bg-white relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Ravi de vous revoir !</h2>
            <p className="mt-1 text-sm text-[#5a6a85bf] font-medium">
              Aperçu en temps réel et démonstration interactive du tableau de bord d&apos;administration.
            </p>
          </div>
          <Image
            src="/admin-assets/images/backgrounds/welcome-bg2.png"
            width={160}
            height={96}
            alt=""
            className="h-20 w-auto object-contain opacity-90"
          />
        </div>
      </AdminCard>

      {/* Top 4 KPI Statistics Cards */}
      {mockStats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <AdminCard
            key={stat.label}
            className="col-span-12 sm:col-span-6 xl:col-span-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-xl text-white ${stat.color} shadow-sm`}>
                <IconComponent size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs">
              <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                <TrendingUp size={12} />
                {stat.change}
              </span>
              <span className="text-slate-400 font-medium">{stat.desc}</span>
            </div>
          </AdminCard>
        );
      })}

      {/* Main Grid: Left Section */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {/* Recent Users Table */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Utilisateurs Récents</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-3 font-bold">Avatar</th>
                  <th className="pb-3 font-bold">Nom</th>
                  <th className="pb-3 font-bold">Rôle</th>
                  <th className="pb-3 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.email} className="border-b border-slate-50 last:border-none group">
                    <td className="py-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        {user.initials}
                      </div>
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      <div>{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{user.email}</div>
                    </td>
                    <td className="py-3 text-slate-500 font-medium">{user.role}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        user.status === "Actif"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : user.status === "Inactif"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-slate-50 text-slate-400 border border-slate-100"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {/* Recent Activity Card */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Activités Récentes</h3>
          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-none last:pb-0">
                <div className="h-2 w-2 rounded-full bg-[#5d87ff] mt-1.5 shrink-0" />
                <div className="flex-1 flex justify-between gap-4">
                  <p className="text-xs font-semibold text-slate-700">{act.text}</p>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Quick Actions Panel */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-[#ecf2ff] hover:text-[#5d87ff] border border-slate-200 hover:border-[#5d87ff]/40 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              <UserPlus size={16} />
              Créer Utilisateur
            </button>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-[#ecf2ff] hover:text-[#5d87ff] border border-slate-200 hover:border-[#5d87ff]/40 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              <FolderPlus size={16} />
              Créer Projet
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-[#ecf2ff] hover:text-[#5d87ff] border border-slate-200 hover:border-[#5d87ff]/40 rounded-xl text-xs font-bold text-slate-700 transition"
            >
              <PlusCircle size={16} />
              Créer Tâche
            </button>
          </div>
        </AdminCard>
      </div>

      {/* Main Grid: Right Section */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        {/* Task Distribution (Donut Card) */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Statut des Tâches</h3>
          
          <div className="flex items-center justify-center py-4 relative">
            {/* SVG Donut Ring */}
            <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
              {/* Terminées: Dasharray offset math */}
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
              {/* Segment 1: Green (Terminées) 48% -> dasharray=181, offset=0 */}
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#10b981" strokeWidth="16"
                strokeDasharray="181 377" strokeDashoffset="0" />
              {/* Segment 2: Blue (En Cours) 30% -> dasharray=113, offset=-181 */}
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#5d87ff" strokeWidth="16"
                strokeDasharray="113 377" strokeDashoffset="-181" />
              {/* Segment 3: Yellow (En attente) 22% -> dasharray=83, offset=-294 */}
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#f59e0b" strokeWidth="16"
                strokeDasharray="83 377" strokeDashoffset="-294" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-2xl font-black text-slate-800">94</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tâches</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {taskStats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span>{stat.label}</span>
                </div>
                <span className="text-slate-800">{stat.count} ({stat.percent}%)</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Project Status */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Avancement des Projets</h3>
          <div className="space-y-4">
            {projectStatusList.map((proj) => (
              <div key={proj.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{proj.name}</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${proj.color}`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Live Application Data (Real Db integration) */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow border border-[#ecf2ff]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Database size={14} className="text-[#5d87ff]" />
            Données de production
          </h3>
          {loading ? (
            <p className="text-xs text-slate-400">Chargement des données en direct...</p>
          ) : dbData ? (
            <div className="space-y-3 text-xs font-bold text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Globe size={13} /> Offres d&apos;emploi
                </span>
                <span className="text-slate-800">{dbData.offers}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Globe size={13} /> Requêtes traitées
                </span>
                <span className="text-slate-800">{dbData.queries}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <SlidersHorizontal size={13} /> Cartes Kanban
                </span>
                <span className="text-slate-800">{dbData.cards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  ⚠️ Erreurs relevées
                </span>
                <span className="text-rose-600">{dbData.errors}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Impossible de charger les données en direct.</p>
          )}
        </AdminCard>
      </div>

      {/* QUICK ACTIONS DIALOGS */}
      
      {/* 1. Add User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-scale-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-[#dfe5ef] p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <UserPlus size={18} className="text-[#5d87ff]" />
                Créer Utilisateur (Démo)
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nom Complet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alice Dupont"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Adresse E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: alice@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Rôle</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-medium"
                >
                  <option value="ADMIN">Administrateur</option>
                  <option value="ANALYST">Analyste</option>
                  <option value="VIEWER">Visiteur</option>
                </select>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
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

      {/* 2. Create Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-scale-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-[#dfe5ef] p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <FolderPlus size={18} className="text-[#5d87ff]" />
                Créer un Projet (Démo)
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Titre du Projet</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Projet Delta"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Progression Initiale (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={projectProgress}
                  onChange={(e) => setProjectProgress(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[1px] animate-scale-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-[#dfe5ef] p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-1.5">
                <PlusCircle size={18} className="text-[#5d87ff]" />
                Créer une Tâche (Démo)
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Titre de la Tâche</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rédiger le rapport d'activité"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Priorité</label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full rounded-xl border border-[#dfe5ef] px-4 py-2.5 text-sm outline-none focus:border-[#5d87ff] bg-slate-50 focus:bg-white transition font-medium"
                >
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                </select>
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm"
                >
                  Créer Tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
