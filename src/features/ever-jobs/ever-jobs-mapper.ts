import { ContractType, Prisma } from "@prisma/client";
import type { EverJobsPost } from "./ever-jobs-types";

function normalizeLocation(location: EverJobsPost["location"]) {
  if (!location) {
    return { city: "Unknown", country: "Morocco" };
  }

  if (typeof location === "string") {
    return { city: location || "Unknown", country: "Morocco" };
  }

  return {
    city: location.city || location.state || "Unknown",
    country: location.country || "Morocco",
  };
}

function mapContract(job: EverJobsPost): ContractType {
  const jobTypes = (job.jobType ?? []).map((type) => type.toLowerCase());
  const employmentType = job.employmentType?.toLowerCase() ?? "";
  const workMode = job.workFromHomeType?.toLowerCase() ?? "";

  if (job.isRemote || workMode.includes("remote")) return ContractType.REMOTE;
  if (workMode.includes("hybrid")) return ContractType.HYBRID;
  if (jobTypes.some((type) => type.includes("intern")) || employmentType.includes("intern")) {
    return ContractType.INTERNSHIP;
  }
  if (jobTypes.some((type) => type.includes("part")) || employmentType.includes("part")) {
    return ContractType.PART_TIME;
  }
  if (jobTypes.some((type) => type.includes("contract")) || employmentType.includes("contract")) {
    return ContractType.FREELANCE;
  }
  if (jobTypes.some((type) => type.includes("full")) || employmentType.includes("full")) {
    return ContractType.CDI;
  }

  return ContractType.UNKNOWN;
}

function toDate(value: EverJobsPost["datePosted"]) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toJsonValue(job: EverJobsPost): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(job)) as Prisma.InputJsonValue;
}

export function mapEverJobToGatheredOffer(job: EverJobsPost) {
  const location = normalizeLocation(job.location);

  return {
    title: job.title || "Untitled job",
    company: job.companyName || "Unknown company",
    city: location.city,
    contract: mapContract(job),
    skills: job.skills ?? [],
    salaryMin: job.compensation?.minAmount ?? null,
    salaryMax: job.compensation?.maxAmount ?? null,
    aiConfidence: job.legitimacy?.state === "verified" ? 0.95 : 0.85,
    source: job.site || job.atsType || "ever-jobs",
    sourceUrl: job.jobUrlDirect || job.jobUrl || null,
  };
}

export function mapEverJobToPrismaInput(
  job: EverJobsPost,
  params: {
    userId?: string;
    queryHistoryId: string;
  },
): Prisma.JobOfferCreateManyInput {
  const location = normalizeLocation(job.location);
  const compensation = job.compensation;

  return {
    userId: params.userId,
    queryHistoryId: params.queryHistoryId,
    title: job.title || "Untitled job",
    company: job.companyName || null,
    city: location.city,
    country: location.country,
    skills: job.skills ?? [],
    salaryMin: compensation?.minAmount == null ? null : Math.round(compensation.minAmount),
    salaryMax: compensation?.maxAmount == null ? null : Math.round(compensation.maxAmount),
    salaryCurrency: compensation?.currency || "MAD",
    contract: mapContract(job),
    source: job.site || job.atsType || "ever-jobs",
    sourceUrl: job.jobUrlDirect || job.jobUrl || null,
    aiConfidence: job.legitimacy?.state === "verified" ? 0.95 : 0.85,
    rawPayload: toJsonValue(job),
    publishedAt: toDate(job.datePosted),
  };
}
