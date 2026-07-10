export type EverJobsSite =
  | "linkedin"
  | "indeed"
  | "zip_recruiter"
  | "glassdoor"
  | "google"
  | "bayt"
  | "naukri"
  | "bdjobs"
  | "internshala"
  | "exa"
  | "upwork"
  | string;

export type EverJobsSearchRequest = {
  siteType?: EverJobsSite[];
  searchTerm?: string;
  location?: string;
  distance?: number;
  isRemote?: boolean;
  resultsWanted?: number;
  country?: string;
  descriptionFormat?: "markdown" | "html" | "plain" | string;
  requestTimeout?: number;
  enforceAnnualSalary?: boolean;
  companySlug?: string;
  companyUrl?: string;
};

export type EverJobsLocation = {
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export type EverJobsCompensation = {
  interval?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
  currency?: string | null;
};

export type EverJobsPost = {
  id?: string | null;
  title?: string | null;
  companyName?: string | null;
  companyUrl?: string | null;
  jobUrl?: string | null;
  jobUrlDirect?: string | null;
  location?: EverJobsLocation | string | null;
  description?: string | null;
  datePosted?: string | Date | null;
  isRemote?: boolean | null;
  jobType?: string[] | null;
  compensation?: EverJobsCompensation | null;
  skills?: string[] | null;
  workFromHomeType?: string | null;
  employmentType?: string | null;
  department?: string | null;
  atsType?: string | null;
  site?: string | null;
  liveness?: { state?: string; checkedAt?: string } | null;
  legitimacy?: { state?: string; reasons?: string[] } | null;
};

export type EverJobsSearchResponse = {
  count: number;
  jobs: EverJobsPost[];
  cached?: boolean;
  deduped?: boolean;
  raw_count?: number;
  dedup_metrics?: unknown;
};

export type GatherSearchInput = {
  query: string;
  searchTerm: string;
  location: string;
  country: string;
  sites: EverJobsSite[];
  resultsWanted: number;
};
