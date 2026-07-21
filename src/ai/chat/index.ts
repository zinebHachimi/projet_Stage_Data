import { detectIntent } from "../intent";
import { extractEntities } from "../entities";
import { getConversationContext, mergeEntities } from "../context";
import { buildSearchParams } from "../search";
import { searchJobsWithRetry } from "../services/search-service";
import { generateRAGResponse } from "../rag";
import { logChatAnalytics } from "../analytics";
import { sanitizeInput, Timer } from "../utils";
import { ChatPipelineResult, ExtractedEntities, IntentType, JobCard } from "../types";
import { callGemini } from "../services/llm";

// Standard conversational responses for offline/rule-based mode
const FALLBACK_REPLIES = {
  greeting: "Bonjour ! Je suis **AlgoJob AI**, votre assistant virtuel de recherche d'emploi. Comment puis-je vous aider aujourd'hui ? Vous pouvez me demander par exemple : *\"Je cherche un stage en développement Web à Casablanca\"* ou *\"Offres d'emploi Python en télétravail\"*.",
  help: "Je suis conçu pour faciliter votre recherche d'emploi en langage naturel. Écrivez simplement ce que vous cherchez (ex: *\"CDI Node.js à Rabat\"* ou *\"Stage PFE en Data Science\"*). Je vais interroger notre base de données Ever Jobs, extraire les critères, et vous afficher les meilleures correspondances sous forme de cartes interactives !",
  career_advice: "Pour booster votre carrière dans la tech : \n1. **Spécialisez-vous** : Maîtrisez des frameworks modernes (React, Next.js, Spring Boot, FastAPI).\n2. **Travaillez vos projets** : Un portfolio GitHub bien fourni a plus d'impact qu'un CV théorique.\n3. **Ciblez le réseau** : Soyez actif sur LinkedIn et connectez-vous avec des recruteurs.\n\nQuelle technologie ou métier ciblez-vous en ce moment pour que nous cherchions des offres ?",
  unknown: "Je n'ai pas bien compris votre demande. Je suis spécialisé dans la recherche d'offres d'emploi et de stages. Essayez de taper une phrase simple comme : *\"Développeur JavaScript à Casablanca\"*.",
};

export async function runChatPipeline(
  messageContent: string,
  userId?: string,
  conversationId?: string
): Promise<ChatPipelineResult> {
  const timer = new Timer();
  const sanitizedMessage = sanitizeInput(messageContent);

  // 1. Load Conversation Context / Memory
  const { historyText, mergedEntities: previousEntities } = await getConversationContext(userId);

  let intent: IntentType = "unknown";
  let entities: ExtractedEntities = {};
  let jobs: JobCard[] = [];
  let reply = "";
  let backendLatency: number | undefined;

  try {
    // 2. Intent Detection
    intent = await detectIntent(sanitizedMessage, historyText);

    // 3. Entity Extraction
    const currentEntities = await extractEntities(sanitizedMessage, historyText);

    // Merge new entities with previous context (memory retention)
    entities = mergeEntities(previousEntities, currentEntities);

    // 4. Handle Intent
    if (intent === "search_job" || intent === "search_internship") {
      // Build search query and parameters
      const searchParams = buildSearchParams(entities);

      // Override/fine-tune search query depending on intent
      if (intent === "search_internship" && !searchParams.searchTerm.toLowerCase().includes("intern") && !searchParams.searchTerm.toLowerCase().includes("stage")) {
        searchParams.searchTerm = `${searchParams.searchTerm} Internship`;
        searchParams.query = `${searchParams.query} Internship`;
      }

      // 5. Search Ever Jobs Backend via Search Service
      const searchStart = Date.now();
      const searchResult = await searchJobsWithRetry(searchParams);
      backendLatency = Date.now() - searchStart;
      jobs = searchResult.jobs;

      // 6. Simple RAG Layer
      reply = await generateRAGResponse(sanitizedMessage, jobs);

    } else if (intent === "greeting") {
      // General greeting response using LLM or fallback
      const llmReply = await callGemini(
        `Generate a short, friendly greeting response to the user's greeting: "${sanitizedMessage}". Introduce yourself as AlgoJob AI and ask how you can help them find a job.`,
        { temperature: 0.7 }
      );
      reply = llmReply || FALLBACK_REPLIES.greeting;

    } else if (intent === "help") {
      const llmReply = await callGemini(
        `Explain politely how you work as a job search assistant. Prompt text was: "${sanitizedMessage}". Tell the user they can write natural language to search.`,
        { temperature: 0.5 }
      );
      reply = llmReply || FALLBACK_REPLIES.help;

    } else if (intent === "career_advice") {
      const llmReply = await callGemini(
        `Provide helpful career or job interview advice based on the user's prompt: "${sanitizedMessage}". Keep it structured and encouraging.`,
        { temperature: 0.6 }
      );
      reply = llmReply || FALLBACK_REPLIES.career_advice;

    } else {
      reply = FALLBACK_REPLIES.unknown;
    }

    const totalTime = timer.getElapsedMs();
    const status = jobs.length > 0 ? "SUCCESS" : (intent === "search_job" || intent === "search_internship" ? "NO_RESULTS" : "SUCCESS");

    // 7. Log to Analytics (non-blocking)
    logChatAnalytics({
      conversationId: conversationId || userId || "anonymous",
      userId,
      searchQuery: sanitizedMessage,
      normalizedQuery: entities.title || null,
      location: entities.city || (entities.isRemote ? "Remote" : null),
      filters: entities as any,
      responseTime: totalTime,
      backendLatency,
      resultCount: jobs.length,
      status,
    }).catch((err) => {
      console.error("Failed to log chat analytics in background:", err);
    });

    return {
      reply,
      intent,
      entities,
      jobs,
      metrics: {
        responseTime: totalTime,
        backendLatency,
        resultCount: jobs.length,
        status,
      },
    };

  } catch (error) {
    const elapsed = timer.getElapsedMs();
    console.error("Chat Pipeline Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected server error occurred.";

    // Log failed transaction to analytics (non-blocking)
    logChatAnalytics({
      conversationId: conversationId || userId || "anonymous",
      userId,
      searchQuery: sanitizedMessage,
      responseTime: elapsed,
      resultCount: 0,
      status: "FAILED",
      error: errorMessage,
    }).catch((err) => {
      console.error("Failed to log failed chat analytics in background:", err);
    });

    return {
      reply: `Désolé, j'ai rencontré un problème lors de la connexion au service de recherche d'offres d'emploi. Notre équipe technique a été notifiée. Veuillez réessayer dans quelques instants. (Erreur : ${errorMessage})`,
      intent: "unknown",
      entities: {},
      jobs: [],
      metrics: {
        responseTime: elapsed,
        resultCount: 0,
        status: "FAILED",
      },
    };
  }
}
