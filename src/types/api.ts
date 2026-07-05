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
  contract: "CDI" | "HYBRID" | "REMOTE";
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  aiConfidence: number;
  source: string;
};

export type DashboardCityMetric = {
  city: string;
  offers: number;
};
