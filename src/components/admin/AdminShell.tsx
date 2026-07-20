"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, MessageSquareText, PanelsTopLeft, UserCircle, AlertTriangle, BarChart3 } from "lucide-react";

const nav = [
  { href: "/admin", label: "Modern", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/ai/chat", label: "AI Chat", icon: MessageSquareText },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/kanban", label: "Kanban", icon: PanelsTopLeft },
  { href: "/admin/errors", label: "Errors", icon: AlertTriangle },
];


interface AdminUser {
  name?: string | null;
  email: string;
  role?: string;
}

export function AdminShell({ children, user = null }: { children: React.ReactNode; user?: AdminUser | null }) {
  const pathname = usePathname();
  const role = user?.role || "VIEWER";
  const homeLink = "/admin";

  const filteredNav = nav.filter(item => {
    if (role === "VIEWER") {
      // Allowed: dashboard, profile, kanban, calendar, ai/chat
      return ["/admin", "/admin/profile", "/admin/kanban", "/admin/calendar", "/admin/ai/chat"].includes(item.href);
    } else if (role === "ANALYST") {
      // Allowed everything except errors and analytics
      return !["/admin/errors", "/admin/analytics"].includes(item.href);
    }
    // ADMIN can see everything
    return true;
  }).map(item => {
    // Dynamic labeling
    if (role === "VIEWER") {
      if (item.href === "/admin") return { ...item, label: "Mon Espace" };
      if (item.href === "/admin/ai/chat") return { ...item, label: "Assistant AI" };
      if (item.href === "/admin/profile") return { ...item, label: "Mon profil" };
      if (item.href === "/admin/kanban") return { ...item, label: "Mes candidatures" };
      if (item.href === "/admin/calendar") return { ...item, label: "Mes documents" };
    } else if (role === "ANALYST") {
      if (item.href === "/admin") return { ...item, label: "Dashboard RH" };
      if (item.href === "/admin/kanban") return { ...item, label: "Gestion candidatures" };
      if (item.href === "/admin/ai/chat") return { ...item, label: "Gestion offres" };
      if (item.href === "/admin/calendar") return { ...item, label: "Calendrier RH" };
      if (item.href === "/admin/profile") return { ...item, label: "Paramètres" };
    } else { // ADMIN
      if (item.href === "/admin") return { ...item, label: "Dashboard Admin" };
      if (item.href === "/admin/kanban") return { ...item, label: "Gestion offres" };
      if (item.href === "/admin/profile") return { ...item, label: "Paramètres" };
      if (item.href === "/admin/analytics") return { ...item, label: "Statistiques" };
    }
    return item;
  });

  return (
    <div className="admin-dashboard min-h-screen bg-[#f8fafc] text-[#1c2536] antialiased">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[270px] border-r border-[#dfe5ef] bg-white xl:block">
        <Link href={homeLink} className="flex h-[78px] items-center gap-3 px-6" aria-label="AlgoJob admin dashboard">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#5d87ff] text-base font-bold text-white">
            AJ
          </span>
          <span className="text-[20px] font-bold tracking-normal text-[#1c2536]">
            AlgoJob
          </span>
        </Link>
        <nav className="px-6 py-4">
          <p className="mb-2 text-xs font-bold uppercase text-[#5a6a85bf]">
            {role === "VIEWER" ? "Candidat" : role === "ANALYST" ? "Recruteur" : "Admin"}
          </p>
          <div className="space-y-1">
            {filteredNav.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-[#ecf2ff] text-[#5d87ff]" : "text-[#2a3547] hover:bg-[#ecf2ff] hover:text-[#5d87ff]"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-9 rounded-lg bg-[#ecf2ff] p-6">
            <h5 className="text-base font-semibold text-[#2a3547]">Espace {role === "ADMIN" ? "Admin" : role === "ANALYST" ? "RH" : "Candidat"}</h5>
            <p className="mt-1 text-sm text-[#5a6a85bf]">
              {role === "VIEWER" ? "Connecté en tant que candidat." : "Connecté aux données réelles."}
            </p>
          </div>
        </nav>
      </aside>
      <div className="xl:pl-[270px]">
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between bg-[#f8fafc]/95 px-6 py-4 backdrop-blur xl:px-10">
          <div>
            <h1 className="text-[18px] font-semibold leading-tight text-[#1c2536]">
              {role === "ADMIN" ? "Tableau de Bord Administrateur" : role === "ANALYST" ? "Portail Recruteur (RH)" : "Mon Espace Candidat"}
            </h1>
            <p className="text-sm text-[#5a6a85bf]">
              {role === "ADMIN" ? "Gestion globale de la plateforme" : role === "ANALYST" ? "Gestion des offres et candidatures" : "Suivi des candidatures et documents"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                {user.name || user.email} ({role === "ADMIN" ? "Administrateur" : role === "ANALYST" ? "Recruteur" : "Candidat"})
              </span>
            )}
            <Link href="/" className="rounded-md bg-[#5d87ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b73df]">
              Site public
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-6 py-[30px] xl:px-10">{children}</main>
      </div>
    </div>
  );
}

export function AdminCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-md bg-white p-[30px] shadow-[0_1px_4px_rgba(133,146,173,0.2)] ${className}`}>{children}</section>;
}

export function EmptyState({ title }: { title: string }) {
  return <p className="rounded-md border border-dashed border-[#dfe5ef] p-6 text-center text-sm text-[#5a6a85bf]">{title}</p>;
}
