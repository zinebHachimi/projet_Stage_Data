import type { GatheredOffer } from "@/types/api";

export const syntheticOffers: GatheredOffer[] = [
  {
    title: "Senior Data Scientist",
    company: "Atlas AI Labs",
    city: "Casablanca",
    contract: "CDI",
    skills: ["Python", "Spark", "MLOps", "NLP"],
    salaryMin: 28000,
    salaryMax: 42000,
    aiConfidence: 0.94,
    source: "pipeline-simulator",
  },
  {
    title: "Big Data Engineer",
    company: "Maghreb Cloud",
    city: "Rabat",
    contract: "HYBRID",
    skills: ["Kafka", "Scala", "Databricks", "MongoDB"],
    salaryMin: 24000,
    salaryMax: 36000,
    aiConfidence: 0.91,
    source: "pipeline-simulator",
  },
  {
    title: "Analytics Engineer",
    company: "Sahara Fintech",
    city: "Marrakech",
    contract: "REMOTE",
    skills: ["SQL", "dbt", "Power BI", "Python"],
    salaryMin: 18000,
    salaryMax: 30000,
    aiConfidence: 0.88,
    source: "pipeline-simulator",
  },
];
