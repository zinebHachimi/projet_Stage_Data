import { AdminCard, EmptyState } from "@/components/admin/AdminShell";
import { getDashboardOverview } from "@/features/admin/admin-service";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const data = await getDashboardOverview();
  const cards = [
    { label: "Users", value: data.users, color: "#5d87ff" },
    { label: "Job Offers", value: data.offers, color: "#13deb9" },
    { label: "Queries", value: data.queries, color: "#49beff" },
    { label: "Open Errors", value: data.errors, color: "#ef4444" },
    { label: "Events", value: data.events, color: "#f6b51e" },
    { label: "Kanban Cards", value: data.cards, color: "#8754ec" },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <AdminCard className="col-span-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="mt-1 text-sm text-[#5a6a85bf]">Live overview from the application database.</p>
          </div>
          <Image src="/admin-assets/images/backgrounds/welcome-bg2.png" width={160} height={96} alt="" className="h-24 w-auto object-contain" />
        </div>
      </AdminCard>

      {cards.map((card) => (
        <AdminCard key={card.label} className="col-span-12 sm:col-span-6 xl:col-span-2">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-md text-white" style={{ backgroundColor: card.color }}>
              {card.value}
            </span>
            <div>
              <p className="text-sm text-[#5a6a85bf]">{card.label}</p>
              <h3 className="text-2xl font-semibold">{card.value}</h3>
            </div>
          </div>
        </AdminCard>
      ))}

      <AdminCard className="col-span-12 lg:col-span-7">
        <h3 className="mb-5 text-lg font-semibold">Offers by City</h3>
        {data.byCity.length === 0 ? (
          <EmptyState title="No job offer data collected yet." />
        ) : (
          <div className="space-y-4">
            {data.byCity.map((city) => (
              <div key={city.city}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>{city.city}</span>
                  <span>{city._count.city}</span>
                </div>
                <div className="h-2 rounded-full bg-[#ecf2ff]">
                  <div className="h-2 rounded-full bg-[#5d87ff]" style={{ width: `${Math.max(8, Math.min(100, city._count.city * 12))}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <AdminCard className="col-span-12 lg:col-span-5">
        <h3 className="mb-5 text-lg font-semibold">Recent Queries</h3>
        {data.recentQueries.length === 0 ? (
          <EmptyState title="No query history yet." />
        ) : (
          <div className="space-y-4">
            {data.recentQueries.map((query) => (
              <div key={query.id} className="border-b border-[#dfe5ef] pb-4 last:border-0 last:pb-0">
                <p className="font-medium">{query.prompt}</p>
                <p className="mt-1 text-xs uppercase text-[#5a6a85bf]">{query.status}</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
