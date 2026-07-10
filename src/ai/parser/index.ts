import { ExtractedEntities, ChatSearchParams } from "../types";
import { ContractType } from "@prisma/client";

export function parseAndNormalize(entities: ExtractedEntities): ChatSearchParams {
  const {
    title = "",
    employmentType = "",
    city = "",
    country = "",
    isRemote = false,
    isHybrid = false,
  } = entities;

  // Build the search query
  let queryParts: string[] = [];
  if (title) queryParts.push(title);
  if (employmentType && employmentType !== "Full-time") {
    // e.g. "React Internship" or "Python Contract"
    queryParts.push(employmentType);
  }

  const query = queryParts.join(" ").trim() || "Jobs";
  const searchTerm = title || query;

  // Resolve location
  let location = "";
  if (isRemote) {
    location = "Remote";
  } else if (city) {
    location = city;
  } else if (isHybrid) {
    location = "Hybrid";
  } else if (country) {
    location = country;
  }

  // Resolve sites
  const sites = process.env.EVER_JOBS_DEFAULT_SITES
    ? process.env.EVER_JOBS_DEFAULT_SITES.split(",").map((s) => s.trim())
    : ["linkedin", "indeed", "google", "bayt"];

  // Map contract type to internal DB ContractType enum
  let contract: ContractType = ContractType.UNKNOWN;
  if (isRemote) {
    contract = ContractType.REMOTE;
  } else if (isHybrid) {
    contract = ContractType.HYBRID;
  } else if (employmentType === "Internship") {
    contract = ContractType.INTERNSHIP;
  } else if (employmentType === "Contract") {
    contract = ContractType.FREELANCE;
  } else if (employmentType === "Part-time") {
    contract = ContractType.PART_TIME;
  } else if (employmentType === "Full-time") {
    contract = ContractType.CDI;
  }

  return {
    query,
    searchTerm,
    location,
    country: country || process.env.EVER_JOBS_DEFAULT_COUNTRY || "MOROCCO",
    sites,
    resultsWanted: parseInt(process.env.EVER_JOBS_RESULTS_WANTED || "10", 10),
    isRemote: isRemote || undefined,
    contract,
  };
}
