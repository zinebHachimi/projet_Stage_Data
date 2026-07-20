// @ts-nocheck
import type { DashboardCityMetric } from "@/types/api";
import { prisma } from "@/lib/prisma";

export const fallbackDashboardMetrics = {
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

export async function getDashboardMetrics() {
  const [offers, cityGroups, contractGroups, salaryAggregate] = await Promise.all([
    prisma.jobOffer.count(),
    prisma.jobOffer.groupBy({
      by: ["city"],
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
      take: 5,
    }),
    prisma.jobOffer.groupBy({
      by: ["contract"],
      _count: { contract: true },
      orderBy: { _count: { contract: "desc" } },
      take: 6,
    }),
    prisma.jobOffer.aggregate({
      _avg: {
        salaryMin: true,
        salaryMax: true,
        aiConfidence: true,
      },
    }),
  ]);

  if (offers === 0) {
    return fallbackDashboardMetrics;
  }

  const averageSalary =
    salaryAggregate._avg.salaryMin && salaryAggregate._avg.salaryMax
      ? Math.round((salaryAggregate._avg.salaryMin + salaryAggregate._avg.salaryMax) / 2)
      : Math.round(salaryAggregate._avg.salaryMin ?? salaryAggregate._avg.salaryMax ?? 0);

  return {
    totals: {
      offers,
      cities: cityGroups.length,
      medianSalary: averageSalary,
      confidence: Math.round((salaryAggregate._avg.aiConfidence ?? 0) * 100),
    },
    cityDistribution: cityGroups.map((city) => ({
      city: city.city,
      offers: city._count.city,
    })) satisfies DashboardCityMetric[],
    contractDistribution: contractGroups.map((contract) => ({
      contract: contract.contract.replaceAll("_", " "),
      offers: contract._count.contract,
    })),
  };
}
