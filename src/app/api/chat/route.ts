import { NextResponse } from "next/server";
import { parseChatIntent } from "@/features/chat/intent";

type ChatRequest = {
  prompt?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ChatRequest;
  const prompt = String(body.prompt ?? "I want all Data Scientist job offers in Morocco");

  return NextResponse.json({
    reply:
      "I understood the target profile and location. I can trigger a gathering pipeline, normalize skills, infer salary ranges, and refresh the dashboard.",
    parsedIntent: parseChatIntent(prompt),
    nextAction: {
      method: "POST",
      endpoint: "/api/gather",
    },
  });
}
