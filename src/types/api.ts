export type AuthMode = "login" | "register";

export type AuthRequest = {
  action?: AuthMode;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};


export type PublicUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

export type ChatIntent = {
  domain: "job_offers";
  role: string;
  country: string;
  entities: string[];
};

export type GatheredOffer = {
  title: string;
  company: string;
  city: string;
  contract: "CDI" | "CDD" | "FREELANCE" | "INTERNSHIP" | "PART_TIME" | "REMOTE" | "HYBRID" | "UNKNOWN";
  skills: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  aiConfidence: number;
  source: string;
  sourceUrl?: string | null;
};

export type DashboardCityMetric = {
  city: string;
  offers: number;
};
