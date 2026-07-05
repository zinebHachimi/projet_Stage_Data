import type { DashboardCityMetric } from "@/types/api";

type StatsChartProps = {
  data: DashboardCityMetric[];
};

export function StatsChart({ data }: StatsChartProps) {
  const maxOffers = Math.max(...data.map((item) => item.offers));

  return (
    <div className="space-y-4">
      {data.map((item) => {
        const width = `${Math.round((item.offers / maxOffers) * 100)}%`;

        return (
          <div key={item.city} className="grid gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">{item.city}</span>
              <span className="font-semibold text-white">{item.offers}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-200 to-emerald-200"
                style={{ width }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
