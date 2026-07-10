import { IntentType } from "../types";
import { callGemini } from "../services/llm";
import { INTENT_DETECTION_SYSTEM } from "../prompts";

export function getRuleBasedIntent(prompt: string): IntentType {
  const normalized = prompt.toLowerCase().trim();

  // Greetings check
  if (
    /^(bonjour|salut|hello|hi|hey|greetings|bonsoir|yo|coucou|hola)\b/i.test(normalized) ||
    normalized === "hi" ||
    normalized === "hello"
  ) {
    return "greeting";
  }

  // Help request check
  if (
    /\b(help|aide|comment\s+ça\s+marche|fonctionne|how\s+to|what\s+can\s+you\s+do|instructions|que\s+faire|aidez-moi)\b/i.test(
      normalized
    )
  ) {
    return "help";
  }

  // Career Advice check
  if (
    /\b(cv|resume|entretien|interview|conseil|carrière|career|salary|salaire|conseils|portfolio|recruteur|lettre\s+de\s+motivation)\b/i.test(
      normalized
    )
  ) {
    return "career_advice";
  }

  // Internship check
  if (
    /\b(stage|internship|intern|stagiaire|alternance|pfe|coop)\b/i.test(normalized)
  ) {
    return "search_internship";
  }

  // General Job Search check (or default when text is search-like)
  if (
    /\b(job|travail|emploi|cdd|cdi|freelance|postuler|recrute|recrutement|developer|ingénieur|engineer|dev|work|poste|recherche|contrat)\b/i.test(
      normalized
    ) ||
    normalized.split(/\s+/).length >= 2 // If it's a search term like "React Casablanca", assume job search
  ) {
    return "search_job";
  }

  return "unknown";
}

export async function detectIntent(
  prompt: string,
  historyText = ""
): Promise<IntentType> {
  const contextPrompt = historyText
    ? `Conversation History:\n${historyText}\n\nUser Query: "${prompt}"`
    : `User Query: "${prompt}"`;

  const responseText = await callGemini(contextPrompt, {
    systemPrompt: INTENT_DETECTION_SYSTEM,
    jsonMode: true,
  });

  if (responseText) {
    try {
      // Clean JSON formatting from Gemini if any Markdown ticks are present
      const cleaned = responseText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned) as { intent?: IntentType };
      if (parsed.intent) {
        return parsed.intent;
      }
    } catch (e) {
      console.warn("Failed to parse Gemini intent response, using rule-based fallback:", e);
    }
  }

  return getRuleBasedIntent(prompt);
}
