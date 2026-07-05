import { NextResponse } from "next/server";
import { authenticate } from "@/features/auth/auth-service";
import { validateAuthPayload } from "@/features/auth/auth-validation";
import { createSessionResponse } from "@/features/auth/session";
import { jsonError } from "@/lib/http";
import type { AuthRequest } from "@/types/api";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as AuthRequest;
  const validation = validateAuthPayload(payload);

  if (!validation.ok) {
    return jsonError(validation.message, validation.status, "BAD_REQUEST");
  }

  try {
    const result = await authenticate(validation.value);

    if (!result.ok) {
      return jsonError(
        result.message,
        result.status,
        result.status === 409 ? "CONFLICT" : "UNAUTHORIZED",
      );
    }

    return await createSessionResponse(result.user);
  } catch (error) {
    console.error("Authentication error", error);

    return jsonError(
      "Authentication service is unavailable. Confirm MongoDB is running as replica set rs0.",
      503,
      "SERVICE_UNAVAILABLE",
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "auth-workspace-ready",
    methods: ["POST"],
    actions: ["login", "register"],
    isolation: "workspaceSlug",
  });
}
