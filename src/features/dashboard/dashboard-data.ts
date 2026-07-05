import type { DashboardCityMetric } from "@/types/api";

export const dashboardMetrics = {
  totals: {
    offers: 1284,
    cities: 9,
    medianSalary: 26500,
    confidence: 92,
  },
  cityDistribution: [
    { city: "Casablanca", offers: 458 },
    { city: "Rabat", offers: 304 },
    { city: "Marrakech", offers: 176 },
    { city: "Tangier", offers: 142 },
    { city: "Agadir", offers: 96 },
  ] satisfies DashboardCityMetric[],
  contractDistribution: [
    { contract: "CDI", offers: 612 },
    { contract: "Hybrid", offers: 342 },
    { contract: "Remote", offers: 204 },
    { contract: "Freelance", offers: 126 },
  ],
};
