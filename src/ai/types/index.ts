import { ContractType } from "@prisma/client";

export type IntentType =
  | "search_job"
  | "search_internship"
  | "greeting"
  | "help"
  | "career_advice"
  | "unknown";

export interface ExtractedEntities {
  title?: string;
  skills?: string[];
  technology?: string[];
  company?: string;
  city?: string;
  country?: string;
  employmentType?: string;
  isRemote?: boolean;
  isHybrid?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  keywords?: string[];
}

export interface ChatSearchParams {
  query: string;
  searchTerm: string;
  location: string;
  country: string;
  sites: string[];
  resultsWanted: number;
  isRemote?: boolean;
  contract?: ContractType;
}

export interface JobCard {
  id?: string;
  title: string;
  company: string;
  city: string;
  country: string;
  contract: ContractType;
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  source: string;
  sourceUrl: string | null;
  publishedAt: string | null;
  collectedAt: string;
}

export interface ChatPipelineResult {
  reply: string;
  intent: IntentType;
  entities: ExtractedEntities;
  jobs: JobCard[];
  metrics: {
    responseTime: number;
    backendLatency?: number;
    resultCount: number;
    status: "SUCCESS" | "FAILED" | "NO_RESULTS";
  };
}
