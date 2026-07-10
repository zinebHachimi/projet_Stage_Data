"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AdminCard, EmptyState } from "@/components/admin/AdminShell";
import {
  BarChart,
  MessageSquare,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  TrendingUp,
  Cpu,
  MapPin,
  ListCollapse,
  Activity,
} from "lucide-react";

// Dynamically import ApexCharts to disable SSR compilation errors
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type MetricTotals = {
  totalConversations: number;
  totalSearches: number;
  successSearches: number;
  failedSearches: number;
  noResultSearches: number;
  searchSuccessRate: number;
  avgResponseTime: number;
  avgBackendLatency: number;
  avgRetrievedJobs: number;
  avgConversationLength: number;
  systemUptime: number;
  backendAvailability: number;
};

type TagCount = {
  keyword?: string;
  skill?: string;
  title?: string;
  city?: string;
  location?: string;
  count: number;
};

type SearchLog = {
  id: string;
  timestamp: string;
  user: string;
  query: string;
  status: string;
  resultCount: number;
  responseTime: number;
  backendLatency: number | null;
  error: string | null;
};

type AnalyticsData = {
  totals: MetricTotals;
  topKeywords: TagCount[];
  topSkills: TagCount[];
  topTitles: TagCount[];
  topCities: TagCount[];
  locationDistribution: TagCount[];
  searchesPerDay: { date: string; count: number }[];
  recentLogs: SearchLog[];
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAnalytics() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok) {
        setError(payload.error ?? "Failed to fetch analytics");
      } else {
        setData(payload);
      }
    } catch (err) {
      setError("Unable to connect to the analytics API");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#5d87ff] border-r-transparent align-[-0.125em]" />
          <p className="mt-3 text-sm font-semibold text-[#5a6a85bf]">Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <AdminCard>
        <div className="text-center py-10">
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-slate-800">Analytics Error</h3>
          <p className="mt-2 text-sm text-[#5a6a85bf]">{error || "No data available."}</p>
          <button
            onClick={() => void fetchAnalytics()}
            className="mt-4 rounded-md bg-[#5d87ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b73df]"
          >
            Retry
          </button>
        </div>
      </AdminCard>
    );
  }

  const totals = data.totals;

  // Chart configuration for daily searches
  const searchTrendOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    colors: ["#5d87ff"],
    xaxis: {
      categories: data.searchesPerDay.map((d) => d.date),
      labels: {
        style: { colors: "#5a6a85bf", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#5a6a85bf", fontSize: "12px" },
      },
    },
    tooltip: { x: { format: "dd MMM yyyy" } },
    grid: { borderColor: "#dfe5ef", strokeDashArray: 4 },
  };

  const searchTrendSeries = [
    {
      name: "Searches",
      data: data.searchesPerDay.map((d) => d.count),
    },
  ];

  // Chart configuration for location distribution
  const locationOptions: ApexCharts.ApexOptions = {
    chart: { type: "donut" },
    labels: data.locationDistribution.map((l) => l.location || "On-site"),
    colors: ["#5d87ff", "#13deb9", "#49beff", "#ffae1f", "#fa896b"],
    legend: { position: "bottom", labels: { colors: "#2a3547" } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Searches",
              color: "#5a6a85bf",
              formatter: () => String(totals.totalSearches),
            },
          },
        },
      },
    },
  };

  const locationSeries = data.locationDistribution.map((l) => l.count);

  const kpis = [
    {
      label: "Total Conversations",
      value: totals.totalConversations,
      sub: `${totals.avgConversationLength} msg / conv`,
      icon: MessageSquare,
      color: "bg-[#ecf2ff] text-[#5d87ff]",
    },
    {
      label: "Total AI Searches",
      value: totals.totalSearches,
      sub: `${totals.searchSuccessRate}% Success rate`,
      icon: Search,
      color: "bg-[#e6fffa] text-[#13deb9]",
    },
    {
      label: "Success Searches",
      value: totals.successSearches,
      sub: `${totals.noResultSearches} yielded no results`,
      icon: CheckCircle,
      color: "bg-[#e8f7ff] text-[#49beff]",
    },
    {
      label: "Failed Searches",
      value: totals.failedSearches,
      sub: `Backend availability: ${totals.backendAvailability}%`,
      icon: XCircle,
      color: "bg-[#fdede8] text-[#fa896b]",
    },
    {
      label: "Avg Response Time",
      value: `${totals.avgResponseTime} ms`,
      sub: `Backend latency: ${totals.avgBackendLatency} ms`,
      icon: Clock,
      color: "bg-[#fef5e5] text-[#ffae1f]",
    },
    {
      label: "Uptime & Availability",
      value: `${totals.systemUptime}%`,
      sub: "Chatbot service online",
      icon: Activity,
      color: "bg-[#f3f0ff] text-[#8754ec]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <AdminCard>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">AI Analytics Dashboard</h2>
            <p className="text-sm text-[#5a6a85bf]">
              Real-time telemetry gathered from candidate conversation metrics.
            </p>
          </div>
          <button
            onClick={() => void fetchAnalytics()}
            className="flex items-center gap-2 rounded-md bg-[#5d87ff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4b73df] transition"
          >
            Refresh Data
          </button>
        </div>
      </AdminCard>

      {/* KPI Section */}
      <div className="grid grid-cols-12 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <AdminCard
              key={kpi.label}
              className="col-span-12 sm:col-span-6 xl:col-span-4 transition hover:shadow-md hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#5a6a85bf]">{kpi.label}</p>
                  <h3 className="mt-1 text-3xl font-bold text-slate-800">{kpi.value}</h3>
                  <p className="mt-2 text-xs text-[#5a6a85bf] font-medium">{kpi.sub}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </AdminCard>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        <AdminCard className="col-span-12 lg:col-span-8">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <TrendingUp size={20} className="text-[#5d87ff]" />
            Search Traffic Trend (Daily)
          </h3>
          {data.searchesPerDay.length === 0 ? (
            <EmptyState title="No daily search data logged yet." />
          ) : (
            <div className="h-[300px]">
              <Chart
                options={searchTrendOptions}
                series={searchTrendSeries}
                type="area"
                height="100%"
              />
            </div>
          )}
        </AdminCard>

        <AdminCard className="col-span-12 lg:col-span-4">
          <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <MapPin size={20} className="text-[#13deb9]" />
            Work Environment Mode
          </h3>
          {data.locationDistribution.length === 0 ? (
            <EmptyState title="No location metrics yet." />
          ) : (
            <div className="flex h-[300px] flex-col justify-center">
              <Chart
                options={locationOptions}
                series={locationSeries}
                type="donut"
                height="80%"
              />
            </div>
          )}
        </AdminCard>
      </div>

      {/* Rankings Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Top Keywords */}
        <AdminCard className="col-span-12 md:col-span-4">
          <h3 className="mb-4 text-base font-semibold flex items-center gap-2 border-b border-[#dfe5ef] pb-3 text-slate-700">
            <Cpu size={18} className="text-[#5d87ff]" />
            Top Searched Keywords
          </h3>
          {data.topKeywords.length === 0 ? (
            <EmptyState title="No keywords tracked." />
          ) : (
            <div className="space-y-3">
              {data.topKeywords.map((item, idx) => (
                <div key={item.keyword} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ecf2ff] text-xs font-bold text-[#5d87ff]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{item.keyword}</span>
                  </div>
                  <span className="text-xs font-medium rounded-full bg-[#ecf2ff] px-2 py-1 text-[#5d87ff]">
                    {item.count} searches
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Top Skills / Tech */}
        <AdminCard className="col-span-12 md:col-span-4">
          <h3 className="mb-4 text-base font-semibold flex items-center gap-2 border-b border-[#dfe5ef] pb-3 text-slate-700">
            <Briefcase size={18} className="text-[#13deb9]" />
            Top Techs & Skills
          </h3>
          {data.topSkills.length === 0 ? (
            <EmptyState title="No skills tracked." />
          ) : (
            <div className="space-y-3">
              {data.topSkills.map((item, idx) => (
                <div key={item.skill} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e6fffa] text-xs font-bold text-[#13deb9]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{item.skill}</span>
                  </div>
                  <span className="text-xs font-medium rounded-full bg-[#e6fffa] px-2 py-1 text-[#13deb9]">
                    {item.count} times
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Top Cities */}
        <AdminCard className="col-span-12 md:col-span-4">
          <h3 className="mb-4 text-base font-semibold flex items-center gap-2 border-b border-[#dfe5ef] pb-3 text-slate-700">
            <MapPin size={18} className="text-[#ffae1f]" />
            Top Searched Cities
          </h3>
          {data.topCities.length === 0 ? (
            <EmptyState title="No cities tracked." />
          ) : (
            <div className="space-y-3">
              {data.topCities.map((item, idx) => (
                <div key={item.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#fef5e5] text-xs font-bold text-[#ffae1f]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{item.city}</span>
                  </div>
                  <span className="text-xs font-medium rounded-full bg-[#fef5e5] px-2 py-1 text-[#ffae1f]">
                    {item.count} searches
                  </span>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* Logs Table Section */}
      <AdminCard>
        <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
          <ListCollapse size={20} className="text-[#5d87ff]" />
          Detailed Chatbot Search Logs
        </h3>
        {data.recentLogs.length === 0 ? (
          <EmptyState title="No search history logs found in database." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-100 min-w-[800px] border-collapse text-left text-sm text-slate-600">
              <thead>
                <tr className="border-b border-[#dfe5ef] bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Search Query</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Results</th>
                  <th className="px-4 py-3 text-right">Resp. Time</th>
                  <th className="px-4 py-3 text-right">API Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dfe5ef]">
                {data.recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[#5a6a85bf]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 max-w-[120px] truncate">
                      {log.user}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700 max-w-[280px] truncate" title={log.query}>
                      {log.query}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          log.status === "SUCCESS"
                            ? "bg-[#e6fffa] text-[#13deb9]"
                            : log.status === "NO_RESULTS"
                            ? "bg-[#fef5e5] text-[#ffae1f]"
                            : "bg-[#fdede8] text-[#fa896b]"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-700">
                      {log.resultCount}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {log.responseTime} ms
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-700">
                      {log.backendLatency ? `${log.backendLatency} ms` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
