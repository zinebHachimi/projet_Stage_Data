import { JobCard } from "../types";
import { callGemini } from "../services/llm";
import { RAG_SYSTEM } from "../prompts";

export function getOfflineRAGResponse(query: string, jobs: JobCard[]): string {
  if (jobs.length === 0) {
    return `Je suis désolé, mais je n'ai trouvé aucune offre d'emploi correspondant à votre recherche (**"${query}"**). 

💡 **Conseils pour votre recherche :**
- Vérifiez l'orthographe des mots-clés.
- Essayez d'utiliser des termes plus génériques (ex: *"Développeur"* au lieu de *"Expert React Senior"*).
- Élargissez la zone géographique ou essayez des filtres en télétravail (*"Remote"*).`;
  }

  let text = `Voici les **${jobs.length}** offres d'emploi que j'ai trouvées pour votre recherche (**"${query}"**) :\n\n`;

  jobs.forEach((job, index) => {
    const salaryStr =
      job.salaryMin || job.salaryMax
        ? `💵 **Salaire :** ${job.salaryMin ? `${job.salaryMin}` : "—"} - ${
            job.salaryMax ? `${job.salaryMax}` : "—"
          } MAD/mois`
        : "";

    const contractBadge = job.contract ? `\`${job.contract}\`` : "";
    const cityStr = job.city ? `📍 **Ville :** ${job.city}` : "";

    const titleLink = job.sourceUrl ? `[${job.title}](${job.sourceUrl})` : job.title;
    text += `### ${index + 1}. 💼 **${titleLink}**\n`;
    text += `🏢 *${job.company}* | ${cityStr} ${contractBadge}\n`;
    if (job.skills.length > 0) {
      text += `🛠️ **Compétences :** ${job.skills.slice(0, 5).join(", ")}\n`;
    }
    if (job.sourceUrl) {
      text += `🔗 [Postuler ici](${job.sourceUrl})\n`;
    }
    if (salaryStr) {
      text += `${salaryStr}\n`;
    }
    text += `\n`;
  });

  text += `\n✨ Vous pouvez utiliser les boutons d'action sur les cartes ci-dessous pour postuler, voir les détails, ou enregistrer les offres.`;

  return text;
}

export async function generateRAGResponse(
  query: string,
  jobs: JobCard[]
): Promise<string> {
  const jobsContext = jobs
    .map(
      (job, index) => `
Job #${index + 1}:
Title: ${job.title}
Company: ${job.company}
City: ${job.city}
Contract Type: ${job.contract}
Skills: ${job.skills.join(", ")}
Salary Range: ${job.salaryMin || "None"} to ${job.salaryMax || "None"}
Source: ${job.source}
Link: ${job.sourceUrl || "No link"}
`
    )
    .join("\n---\n");

  const prompt = `User Query: "${query}"

Retrieved Job Offers Context:
${jobsContext || "No jobs found matching the criteria."}`;

  // Call LLM
  const response = await callGemini(prompt, {
    systemPrompt: RAG_SYSTEM,
    temperature: 0.1, // low temperature to strictly follow context and avoid hallucination
  });

  if (response) {
    return response;
  }

  // Fallback
  return getOfflineRAGResponse(query, jobs);
}
