import { ExtractedEntities } from "../types";
import { callGemini } from "../services/llm";
import { ENTITY_EXTRACTION_SYSTEM } from "../prompts";

const MOROCCAN_CITIES = [
  "casablanca",
  "rabat",
  "marrakech",
  "tangier",
  "tanger",
  "agadir",
  "fes",
  "fez",
  "meknes",
  "oujda",
  "kenitra",
  "tetouan",
  "temara",
  "mohammedia",
  "el jadida",
  "safi",
  "nador",
  "laayoune",
  "dakhla",
  "ouarzazate",
];

const COMMON_TECH = [
  "react",
  "vue",
  "angular",
  "node",
  "next.js",
  "nextjs",
  "nest.js",
  "nestjs",
  "express",
  "python",
  "django",
  "flask",
  "fastapi",
  "java",
  "spring",
  "springboot",
  "c#",
  "dotnet",
  "php",
  "laravel",
  "symfony",
  "javascript",
  "typescript",
  "ruby",
  "rails",
  "golang",
  "rust",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "devops",
  "qa",
  "testing",
  "ui/ux",
  "figma",
  "flutter",
  "react native",
  "data scientist",
  "data analyst",
  "machine learning",
  "deep learning",
  "artificial intelligence",
  "ai",
  "excel",
  "powerbi",
];

export function getRuleBasedEntities(prompt: string): ExtractedEntities {
  const normalized = prompt.toLowerCase();
  const entities: ExtractedEntities = {};

  // Extract City
  for (const city of MOROCCAN_CITIES) {
    const regex = new RegExp(`\\b${city}\\b`, "i");
    if (regex.test(normalized)) {
      entities.city = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Extract Remote / Hybrid
  if (/\b(remote|télétravail|a distance|à distance|home office|distanciel)\b/i.test(normalized)) {
    entities.isRemote = true;
  }
  if (/\b(hybrid|hybride|mixte|semi-remote)\b/i.test(normalized)) {
    entities.isHybrid = true;
  }

  // Extract Employment / Contract Type
  if (/\b(stage|internship|intern|stagiaire|alternance|pfe|coop)\b/i.test(normalized)) {
    entities.employmentType = "Internship";
  } else if (/\b(freelance|contractor|indépendant|independant|contrat|freelancer)\b/i.test(normalized)) {
    entities.employmentType = "Contract";
  } else if (/\b(cdi|cdd|full-time|fulltime|plein\s+temps)\b/i.test(normalized)) {
    entities.employmentType = "Full-time";
  } else if (/\b(part-time|parttime|temps\s+partiel)\b/i.test(normalized)) {
    entities.employmentType = "Part-time";
  }

  // Extract Tech Stack / Skills
  const foundSkills: string[] = [];
  const foundTech: string[] = [];
  for (const tech of COMMON_TECH) {
    // Escape special characters like . or #
    const escaped = tech.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(normalized)) {
      if (["react", "angular", "vue", "next.js", "nextjs", "nestjs", "laravel", "symfony", "spring", "springboot"].includes(tech)) {
        foundTech.push(tech.charAt(0).toUpperCase() + tech.slice(1));
      } else {
        foundSkills.push(tech.toUpperCase());
      }
    }
  }

  if (foundSkills.length > 0) entities.skills = foundSkills;
  if (foundTech.length > 0) entities.technology = foundTech;

  // Infer Title / Role
  let titleMatch = normalized.match(/(?:devenir|recherche|comme|job\s+de|stage\s+de)\s+([^,.]+)/i);
  if (!titleMatch && foundTech.length > 0) {
    entities.title = `${foundTech[0]} Developer`;
  } else if (titleMatch) {
    entities.title = titleMatch[1]?.trim();
  } else {
    // Check if any technology can serve as the title
    const words = normalized.split(/\s+/);
    const titleCandidates = words.filter(w => COMMON_TECH.includes(w));
    if (titleCandidates.length > 0) {
      entities.title = titleCandidates[0] ? titleCandidates[0].charAt(0).toUpperCase() + titleCandidates[0].slice(1) : undefined;
    }
  }

  // Salary Extraction (simple match)
  const salaryMatch = normalized.match(/(\d+)\s*(?:dh|mad|dirhams?|k)/i);
  if (salaryMatch && salaryMatch[1]) {
    const amount = parseInt(salaryMatch[1], 10);
    if (amount < 200) {
      // In thousands e.g. 10k or 15k
      entities.salaryMin = amount * 1000;
    } else {
      entities.salaryMin = amount;
    }
  }

  // Keywords
  entities.keywords = normalized.split(/\s+/).filter(w => w.length > 2);

  return entities;
}

export async function extractEntities(
  prompt: string,
  historyText = ""
): Promise<ExtractedEntities> {
  const contextPrompt = historyText
    ? `Conversation History:\n${historyText}\n\nUser Query to parse: "${prompt}"`
    : `User Query to parse: "${prompt}"`;

  const responseText = await callGemini(contextPrompt, {
    systemPrompt: ENTITY_EXTRACTION_SYSTEM,
    jsonMode: true,
  });

  if (responseText) {
    try {
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned) as ExtractedEntities;
      // Clean undefined/null fields
      const result: ExtractedEntities = {};
      Object.entries(parsed).forEach(([key, val]) => {
        if (val !== null && val !== undefined && !(Array.isArray(val) && val.length === 0)) {
          (result as any)[key] = val;
        }
      });
      return result;
    } catch (e) {
      console.warn("Failed to parse Gemini extracted entities, using rule-based fallback:", e);
    }
  }

  return getRuleBasedEntities(prompt);
}
