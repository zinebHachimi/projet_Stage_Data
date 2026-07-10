import { searchEverJobs } from "@/features/ever-jobs/ever-jobs-client";
import { mapEverJobToGatheredOffer } from "@/features/ever-jobs/ever-jobs-mapper";
import { ChatSearchParams, JobCard } from "../types";
import { ContractType } from "@prisma/client";

// In-memory cache for queries
const searchCache = new Map<string, { jobs: JobCard[]; expiry: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

export interface SearchServiceResult {
  jobs: JobCard[];
  latencyMs: number;
}

export async function searchJobsWithRetry(
  params: ChatSearchParams,
  retries = 3,
  delayMs = 1000
): Promise<SearchServiceResult> {
  const cacheKey = JSON.stringify({
    searchTerm: params.searchTerm,
    location: params.location,
    sites: params.sites,
    resultsWanted: params.resultsWanted,
  });

  // Check cache
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    console.log("Serving job search from in-memory cache.");
    return { jobs: cached.jobs, latencyMs: 0 };
  }

  let attempt = 0;
  const startTime = Date.now();

  while (attempt < retries) {
    attempt++;
    try {
      console.log(`Searching Ever Jobs: attempt ${attempt} of ${retries} for query "${params.searchTerm}" in "${params.location}"`);

      // Invoke the client
      const response = await searchEverJobs({
        siteType: params.sites,
        searchTerm: params.searchTerm,
        location: params.location,
        country: params.country,
        resultsWanted: params.resultsWanted,
        descriptionFormat: "markdown",
        requestTimeout: 30, // 30 seconds timeout per retry
      });

      const latencyMs = Date.now() - startTime;

      // Map EverJobsPost to JobCard
      const mappedJobs: JobCard[] = response.jobs.map((job, idx) => {
        const mapped = mapEverJobToGatheredOffer(job);
        return {
          id: job.id || `job-${Date.now()}-${idx}`,
          title: mapped.title,
          company: mapped.company,
          city: mapped.city,
          country: params.country,
          contract: mapped.contract,
          skills: mapped.skills,
          salaryMin: mapped.salaryMin,
          salaryMax: mapped.salaryMax,
          salaryCurrency: "MAD",
          source: mapped.source,
          sourceUrl: mapped.sourceUrl,
          publishedAt: job.datePosted ? new Date(job.datePosted).toISOString() : null,
          collectedAt: new Date().toISOString(),
        };
      });

      // Save to cache
      searchCache.set(cacheKey, {
        jobs: mappedJobs,
        expiry: Date.now() + CACHE_TTL_MS,
      });

      return { jobs: mappedJobs, latencyMs };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt >= retries) {
        const latencyMs = Date.now() - startTime;
        throw new Error(`Search failed after ${retries} attempts. Original error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Unreachable search state.");
}
