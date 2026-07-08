"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, MessageSquareText, PanelsTopLeft, UserCircle, AlertTriangle } from "lucide-react";

const nav = [
  { href: "/admin", label: "Modern", icon: LayoutDashboard },
  { href: "/admin/ai/chat", label: "AI Chat", icon: MessageSquareText },
  { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/kanban", label: "Kanban", icon: PanelsTopLeft },
  { href: "/admin/errors", label: "Errors", icon: AlertTriangle },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="admin-dashboard min-h-screen bg-[#f8fafc] text-[#1c2536] antialiased">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[270px] border-r border-[#dfe5ef] bg-white xl:block">
        <Link href="/admin" className="flex h-[78px] items-center gap-3 px-6" aria-label="AlgoJob admin dashboard">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#5d87ff] text-base font-bold text-white">
            AJ
          </span>
          <span className="text-[20px] font-bold tracking-normal text-[#1c2536]">
            AlgoJob
          </span>
        </Link>
        <nav className="px-6 py-4">
          <p className="mb-2 text-xs font-bold uppercase text-[#5a6a85bf]">Home</p>
          <div className="space-y-1">
            {nav.map((item) => {
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
            <h5 className="text-base font-semibold text-[#2a3547]">AlgoJob workspace</h5>
            <p className="mt-1 text-sm text-[#5a6a85bf]">Connected to live application data.</p>
          </div>
        </nav>
      </aside>
      <div className="xl:pl-[270px]">
        <header className="sticky top-0 z-20 flex min-h-[72px] items-center justify-between bg-[#f8fafc]/95 px-6 py-4 backdrop-blur xl:px-10">
          <div>
            <h1 className="text-[18px] font-semibold leading-tight text-[#1c2536]">Admin Dashboard</h1>
            <p className="text-sm text-[#5a6a85bf]">Single Next.js application</p>
          </div>
          <Link href="/" className="rounded-md bg-[#5d87ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b73df]">
            Public site
          </Link>
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
