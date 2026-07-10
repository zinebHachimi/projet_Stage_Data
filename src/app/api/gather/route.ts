import { NextResponse } from "next/server";
import { runGatherPipeline, type GatherRequest } from "@/features/gather/gather-service";
import { getCurrentUser } from "@/lib/current-user";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as GatherRequest;
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: { message: "Unauthorized. Please log in." } }, { status: 401 });
  }

  try {
    const result = await runGatherPipeline(body, user.id);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gather pipeline failed.";
    return NextResponse.json({ error: { message } }, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    engine: "ever-jobs-internal-service",
    acceptedMethod: "POST",
    backendUrl: process.env.EVER_JOBS_API_URL || "http://localhost:3001",
  });
}
