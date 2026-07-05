import type { ChatIntent } from "@/types/api";

export function parseChatIntent(prompt: string): ChatIntent {
  return {
    domain: "job_offers",
    role: /data scientist/i.test(prompt) ? "Data Scientist" : "Data",
    country: /morocco|maroc/i.test(prompt) ? "Morocco" : "Unknown",
    entities: ["skills", "city", "salary", "contract"],
  };
}
