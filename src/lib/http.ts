import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "CONFLICT"
  | "SERVICE_UNAVAILABLE";

export function jsonError(message: string, status: number, code: ApiErrorCode) {
  return NextResponse.json({ error: { code, message } }, { status });
}
