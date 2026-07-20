// @ts-nocheck
import { QueryStatus } from "@prisma/client";
import { searchEverJobs } from "@/features/ever-jobs/ever-jobs-client";
import { mapEverJobToGatheredOffer, mapEverJobToPrismaInput } from "@/features/ever-jobs/ever-jobs-mapper";
import type { EverJobsSite, GatherSearchInput } from "@/features/ever-jobs/ever-jobs-types";
import { prisma } from "@/lib/prisma";

export type GatherRequest = {
  query?: string;
  searchTerm?: string;
  location?: string;
  country?: string;
  sites?: string[];
  resultsWanted?: number;
};

function splitSites(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((site) => site.trim())
    .filter(Boolean);
}

function normalizeSites(sites: unknown): EverJobsSite[] {
  if (Array.isArray(sites)) {
    return sites.map(String).map((site) => site.trim()).filter(Boolean);
  }

  const configuredSites = splitSites(process.env.EVER_JOBS_DEFAULT_SITES);
  if (configuredSites.length > 0) return configuredSites;

  return ["linkedin", "indeed", "google", "bayt"];
}

function inferSearchInput(body: GatherRequest): GatherSearchInput {
  const query = String(body.query || body.searchTerm || "Data Scientist jobs in Morocco").trim();
  const inferredLocation = query.match(/\bin\s+([^,]+)$/i)?.[1]?.trim();

  return {
    query,
    searchTerm: String(body.searchTerm || query.replace(/\s+jobs?\s+in\s+.+$/i, "") || query).trim(),
    location: String(body.location || inferredLocation || process.env.EVER_JOBS_DEFAULT_LOCATION || "Morocco").trim(),
    country: String(body.country || process.env.EVER_JOBS_DEFAULT_COUNTRY || "MOROCCO").trim().toUpperCase(),
    sites: normalizeSites(body.sites),
    resultsWanted: Math.max(1, Math.min(50, Number(body.resultsWanted || process.env.EVER_JOBS_RESULTS_WANTED || 10))),
  };
}

export async function runGatherPipeline(body: GatherRequest, userId: string) {
  const input = inferSearchInput(body);

  const queryHistory = await prisma.queryHistory.create({
    data: {
      userId,
      prompt: input.query,
      status: QueryStatus.RUNNING,
      normalizedQuery: {
        searchTerm: input.searchTerm,
        location: input.location,
        country: input.country,
        sites: input.sites,
        resultsWanted: input.resultsWanted,
      },
    },
  });

  try {
    const result = await searchEverJobs({
      siteType: input.sites,
      searchTerm: input.searchTerm,
      location: input.location,
      country: input.country,
      resultsWanted: input.resultsWanted,
      descriptionFormat: "markdown",
      requestTimeout: 60,
    });

    const offers = result.jobs.map((job) =>
      mapEverJobToPrismaInput(job, {
        userId,
        queryHistoryId: queryHistory.id,
      }),
    );

    if (offers.length > 0) {
      await prisma.jobOffer.createMany({ data: offers });
    }

    await prisma.queryHistory.update({
      where: { id: queryHistory.id },
      data: {
        status: QueryStatus.COMPLETED,
        resultCount: offers.length,
      },
    });

    return {
      pipelineRunId: queryHistory.id,
      status: "completed",
      query: input.query,
      connectors: input.sites,
      stages: [
        "intent_detection",
        "ever_jobs_collection",
        "schema_normalization",
        "database_persistence",
        "dashboard_refresh",
      ],
      count: offers.length,
      preview: result.jobs.slice(0, 10).map(mapEverJobToGatheredOffer),
      cached: result.cached ?? false,
      deduped: result.deduped ?? false,
      rawCount: result.raw_count ?? result.count,
      message: "Ever Jobs collection completed and persisted successfully.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ever Jobs collection failed.";

    await prisma.queryHistory.update({
      where: { id: queryHistory.id },
      data: {
        status: QueryStatus.FAILED,
        errorMessage: message,
      },
    });

    throw new Error(message);
  }
}
