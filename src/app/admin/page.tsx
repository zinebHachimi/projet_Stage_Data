"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  recentQueries: Array<{ id: string; prompt: string; status: string; createdAt: string }>;
  recentOffers: Array<{ id: string; title: string; company?: string | null; city: string; aiConfidence: number; collectedAt: string }>;
  contracts: Array<{ contract: string; count: number }>;
  recentUsers: Array<{ id: string; name: string; email: string; role: string; rawRole: string; status: string; initials: string; color: string }>;
};

export default function AdminHomePage() {
  const [dbData, setDbData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name?: string | null; email: string; role: string } | null>(null);

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

  // Load database live metrics and current user profile
  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await fetch("/api/auth/me");
        const userData = await userRes.json();
        if (userRes.ok && userData.user) {
          setCurrentUser(userData.user);
        }

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
    void fetchData();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          role: userRole,
          password: "AlgoJobDefault2026!",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        triggerToast(`Erreur : ${data.error || "Impossible de créer l'utilisateur"}`);
        return;
      }
      triggerToast(`Utilisateur "${userName}" créé avec succès !`);
      setIsUserModalOpen(false);
      setUserName("");
      setUserEmail("");
      
      // Refresh overview
      const refreshRes = await fetch("/api/admin/dashboard");
      const refreshData = await refreshRes.json();
      if (refreshRes.ok) setDbData(refreshData);
    } catch {
      triggerToast("Erreur de connexion réseau");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        triggerToast(`Erreur : ${data.error || "Impossible de modifier le rôle"}`);
        return;
      }
      triggerToast("Rôle mis à jour avec succès !");
      
      // Refresh overview
      const refreshRes = await fetch("/api/admin/dashboard");
      const refreshData = await refreshRes.json();
      if (refreshRes.ok) setDbData(refreshData);
    } catch {
      triggerToast("Erreur de connexion réseau");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement le compte de ${email} ?`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        triggerToast(`Erreur : ${data.error || "Impossible de supprimer l'utilisateur"}`);
        return;
      }
      triggerToast("Utilisateur supprimé !");
      
      // Refresh overview
      const refreshRes = await fetch("/api/admin/dashboard");
      const refreshData = await refreshRes.json();
      if (refreshRes.ok) setDbData(refreshData);
    } catch {
      triggerToast("Erreur de connexion réseau");
    }
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

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center bg-white rounded-2xl shadow-sm border border-[#dfe5ef]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5d87ff] mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Chargement des statistiques en direct...</p>
        </div>
      </div>
    );
  }

  const role = currentUser?.role || "ANALYST";

  if (!dbData || (dbData.users === 0 && dbData.offers === 0)) {
    return (
      <div className="flex flex-col h-[400px] items-center justify-center bg-white rounded-2xl shadow-sm border border-[#dfe5ef] p-10 text-center">
        <Database size={48} className="text-slate-300 mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-slate-800">Aucune donnée disponible</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          Le tableau de bord est connecté à la base de données réelle, mais aucune donnée n&apos;a encore été collectée.
        </p>
        {role !== "VIEWER" && (
          <Link href="/admin/ai/chat" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#5d87ff] px-5 py-3 text-xs font-semibold text-white hover:bg-[#4b73df] transition shadow-sm text-decoration-none">
            Lancer la collecte via le Chatbot
          </Link>
        )}
      </div>
    );
  }

  // Construct dynamic KPI cards
  const kpis = role === "ADMIN" ? [
    { label: "Utilisateurs Totaux", value: String(dbData.users ?? 0), desc: "Inscrits en base de données", icon: Users, color: "bg-[#5d87ff]" },
    { label: "Offres d'emploi", value: String(dbData.offers ?? 0), desc: "Données collectées réelles", icon: Database, color: "bg-emerald-500" },
    { label: "Requêtes IA traitées", value: String(dbData.queries ?? 0), desc: "Pipelines conversationnels", icon: Activity, color: "bg-indigo-500" },
    { label: "Erreurs relevées", value: String(dbData.errors ?? 0), desc: "En attente de résolution", icon: X, color: "bg-rose-500" },
  ] : [
    { label: "Offres d'emploi", value: String(dbData.offers ?? 0), desc: "Données disponibles", icon: Database, color: "bg-emerald-500" },
    { label: "Requêtes traitées", value: String(dbData.queries ?? 0), desc: "Historique chatbot", icon: Activity, color: "bg-indigo-500" },
    { label: "Candidatures actives", value: String(dbData.cards ?? 0), desc: "Colonnes Kanban", icon: FolderKanban, color: "bg-[#5d87ff]" },
    { label: "Événements Calendrier", value: String(dbData.events ?? 0), desc: "Rendez-vous à venir", icon: ListTodo, color: "bg-amber-500" },
  ];

  // Dynamic Recent Activities based on real database records
  const recentActivities = [
    ...(dbData.recentOffers ?? []).slice(0, 3).map((offer) => ({
      id: `offer-${offer.id}`,
      text: `Offre d'emploi collectée : "${offer.title}" chez ${offer.company || "Inconnu"} (${offer.city})`,
      time: offer.collectedAt ? new Date(offer.collectedAt).toLocaleDateString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : "Récemment",
      type: "offer"
    })),
    ...(dbData.recentQueries ?? []).slice(0, 2).map((q) => ({
      id: `query-${q.id}`,
      text: `Requête IA traitée : "${q.prompt.substring(0, 50)}${q.prompt.length > 50 ? '...' : ''}"`,
      time: q.createdAt ? new Date(q.createdAt).toLocaleDateString("fr-FR", { hour: '2-digit', minute: '2-digit' }) : "Récemment",
      type: "query"
    })),
  ];

  // City offers distribution calculations
  const cityDistribution = dbData.byCity || [];
  const maxOffers = cityDistribution.length > 0 ? Math.max(...cityDistribution.map(c => c._count.city)) : 1;
  const projectStatusList = cityDistribution.map((c, index) => ({
    name: c.city,
    progress: Math.round((c._count.city / maxOffers) * 100),
    count: c._count.city,
    color: index === 0 ? "bg-[#5d87ff]" : index === 1 ? "bg-amber-500" : index === 2 ? "bg-emerald-500" : "bg-indigo-500",
  }));

  // Contract donut calculations
  const rawContracts = dbData.contracts || [];
  const totalContracts = rawContracts.reduce((sum, c) => sum + c.count, 0);
  const contractStats = rawContracts.map((c, index) => {
    const percent = totalContracts > 0 ? Math.round((c.count / totalContracts) * 100) : 0;
    return {
      label: c.contract.replaceAll("_", " "),
      count: c.count,
      percent,
      color: index === 0 ? "#10b981" : index === 1 ? "#5d87ff" : "#f59e0b",
    };
  });

  // Calculate dynamic SVG segments for the donut chart
  let currentOffset = 0;
  const svgCircles = contractStats.map((stat) => {
    const dashArrayVal = Math.round((stat.percent / 100) * 377);
    const strokeDasharray = `${dashArrayVal} 377`;
    const strokeDashoffset = String(currentOffset);
    currentOffset -= dashArrayVal;
    return (
      <circle
        key={stat.label}
        cx="80"
        cy="80"
        r="60"
        fill="transparent"
        stroke={stat.color}
        strokeWidth="16"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    );
  });

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
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-80 border-0 bg-transparent text-white p-0 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Welcome Message Card */}
      <AdminCard className="col-span-12 shadow-sm hover:shadow transition-shadow overflow-hidden bg-white relative">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Ravi de vous revoir, {currentUser?.name || currentUser?.email.split("@")[0]} !
            </h2>
            <p className="mt-1 text-sm text-[#5a6a85bf] font-medium">
              Aperçu en temps réel basé sur les données réelles de la base de données.
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
      {kpis.map((stat) => {
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
            <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span>{stat.desc}</span>
            </div>
          </AdminCard>
        );
      })}

      {/* Main Grid: Left Section */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        {role === "ADMIN" ? (
          /* Recent Users Table */
          <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Utilisateurs Récents</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 font-bold">Avatar</th>
                    <th className="pb-3 font-bold">Nom</th>
                    <th className="pb-3 font-bold flex items-center">Rôle</th>
                    <th className="pb-3 font-bold">Statut</th>
                    <th className="pb-3 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dbData.recentUsers && dbData.recentUsers.length > 0 ? (
                    dbData.recentUsers.map((u, i) => (
                      <tr key={`${u.email}-${i}`} className="border-b border-slate-50 last:border-none group">
                        <td className="py-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                            {u.initials}
                          </div>
                        </td>
                        <td className="py-3 font-semibold text-slate-800">
                          <div>{u.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                        </td>
                        <td className="py-3 text-slate-500 font-medium">{u.role}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <select
                              value={u.rawRole}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                              className="border border-[#dfe5ef] rounded-lg text-[10px] px-2 py-1 bg-white font-bold text-slate-600 outline-none"
                            >
                              <option value="ADMIN">Admin</option>
                              <option value="ANALYST">Recruteur</option>
                              <option value="VIEWER">Candidat</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              className="px-2 py-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition text-[10px] font-bold cursor-pointer"
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-slate-400 font-medium">Aucun utilisateur disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        ) : (
          /* Recent Offers Table for Recruiter */
          <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Offres Récemment Collectées</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-3 font-bold">Titre</th>
                    <th className="pb-3 font-bold">Entreprise</th>
                    <th className="pb-3 font-bold">Ville</th>
                    <th className="pb-3 font-bold">Confiance IA</th>
                  </tr>
                </thead>
                <tbody>
                  {dbData.recentOffers && dbData.recentOffers.length > 0 ? (
                    dbData.recentOffers.map((offer) => (
                      <tr key={offer.id} className="border-b border-slate-50 last:border-none group">
                        <td className="py-3 font-semibold text-slate-800">{offer.title}</td>
                        <td className="py-3 text-slate-500 font-medium">{offer.company || "Inconnu"}</td>
                        <td className="py-3 text-slate-500 font-medium">{offer.city}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {Math.round(offer.aiConfidence * 100)}%
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-400 font-medium">Aucune offre disponible</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        )}

        {/* Recent Activity Card */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Activités Récentes</h3>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 border-b border-slate-50 pb-3 last:border-none last:pb-0">
                  <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${act.type === "offer" ? "bg-emerald-500" : "bg-[#5d87ff]"}`} />
                  <div className="flex-1 flex justify-between gap-4">
                    <p className="text-xs font-semibold text-slate-700">{act.text}</p>
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">{act.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 font-medium py-2">Aucune activité récente enregistrée.</p>
            )}
          </div>
        </AdminCard>

        {/* Quick Actions Panel */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Actions Rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-[#ecf2ff] hover:text-[#5d87ff] border border-slate-200 hover:border-[#5d87ff]/40 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <UserPlus size={16} />
              Créer Utilisateur
            </button>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-[#ecf2ff] hover:text-[#5d87ff] border border-slate-200 hover:border-[#5d87ff]/40 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
            >
              <FolderPlus size={16} />
              Créer Projet
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-[#ecf2ff] hover:text-[#5d87ff] border border-slate-200 hover:border-[#5d87ff]/40 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
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
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Types de Contrats</h3>
          
          <div className="flex items-center justify-center py-4 relative">
            {/* SVG Donut Ring */}
            <svg width="160" height="160" viewBox="0 0 160 160" className="rotate-[-90deg]">
              <circle cx="80" cy="80" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="16" />
              {svgCircles}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <span className="text-2xl font-black text-slate-800">{totalContracts}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Offres</span>
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {contractStats.length > 0 ? (
              contractStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    <span>{stat.label}</span>
                  </div>
                  <span className="text-slate-800">{stat.count} ({stat.percent}%)</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-2">Aucun contrat répertorié</p>
            )}
          </div>
        </AdminCard>

        {/* Project Status */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Répartition par Ville</h3>
          <div className="space-y-4">
            {projectStatusList.length > 0 ? (
              projectStatusList.map((proj) => (
                <div key={proj.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span>{proj.name}</span>
                    <span>{proj.count} offre{proj.count > 1 ? 's' : ''} ({proj.progress}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${proj.color}`}
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-2">Aucune donnée par ville.</p>
            )}
          </div>
        </AdminCard>

        {/* Live Application Data (Real Db integration) */}
        <AdminCard className="bg-white shadow-sm hover:shadow transition-shadow border border-[#ecf2ff]">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Database size={14} className="text-[#5d87ff]" />
            Données de production
          </h3>
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
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer"
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
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm cursor-pointer border-0"
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
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer"
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
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm cursor-pointer border-0"
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
                className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition border-0 bg-transparent cursor-pointer"
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
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#5d87ff] hover:bg-[#4b73df] py-2.5 text-xs font-semibold text-white transition shadow-sm cursor-pointer border-0"
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
