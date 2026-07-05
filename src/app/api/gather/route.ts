import { NextResponse } from "next/server";
import { syntheticOffers } from "@/features/gather/synthetic-offers";

type GatherRequest = {
  query?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GatherRequest;
  const query = String(body.query ?? "Data Scientist jobs in Morocco");

  return NextResponse.json(
    {
      pipelineRunId: crypto.randomUUID(),
      status: "queued",
      query,
      connectors: ["job-boards", "company-careers", "linkedin-export"],
      stages: [
        "intent_detection",
        "distributed_collection",
        "ai_cleaning",
        "schema_normalization",
        "dashboard_refresh",
      ],
      preview: syntheticOffers,
      message:
        "Pipeline trigger simulated. Replace this route with queue dispatch, scraping connectors, and Prisma persistence.",
    },
    { status: 202 },
  );
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    engine: "agentic-pipeline-simulator",
    acceptedMethod: "POST",
  });
}
