import { prisma } from "@/lib/prisma";
import { ExtractedEntities } from "../types";

export interface ConversationHistoryResult {
  historyText: string;
  mergedEntities: ExtractedEntities;
  lastSearchEntities: ExtractedEntities | null;
}

export async function getConversationContext(
  userId?: string,
  limit = 6
): Promise<ConversationHistoryResult> {
  if (!userId) {
    return { historyText: "", mergedEntities: {}, lastSearchEntities: null };
  }

  // Fetch recent messages
  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  // Chronological order
  const chronological = [...messages].reverse();

  // Format history transcript
  const historyText = chronological
    .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n");

  // Find the last search request from user messages in this chat session to merge entities
  let lastSearchEntities: ExtractedEntities | null = null;

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg && msg.role === "user" && msg.metadata) {
      try {
        const metadata = typeof msg.metadata === "string" ? JSON.parse(msg.metadata) : msg.metadata;
        if (metadata && metadata.entities) {
          lastSearchEntities = metadata.entities as ExtractedEntities;
          break;
        }
      } catch (err) {
        // Ignore parsing errors
      }
    }
  }

  return {
    historyText,
    mergedEntities: { ...(lastSearchEntities || {}) },
    lastSearchEntities,
  };
}

export function mergeEntities(
  previous: ExtractedEntities,
  current: ExtractedEntities
): ExtractedEntities {
  // Merge current entities into previous entities, letting current override previous
  const merged: ExtractedEntities = { ...previous };

  Object.entries(current).forEach(([key, val]) => {
    if (val !== null && val !== undefined && !(Array.isArray(val) && val.length === 0)) {
      (merged as any)[key] = val;
    }
  });

  return merged;
}
