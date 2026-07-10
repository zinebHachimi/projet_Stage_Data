import type { EverJobsSearchRequest, EverJobsSearchResponse } from "./ever-jobs-types";

const DEFAULT_EVER_JOBS_URL = "http://localhost:3001";
const DEFAULT_TIMEOUT_MS = 90_000;

function getBaseUrl() {
  return (process.env.EVER_JOBS_API_URL || DEFAULT_EVER_JOBS_URL).replace(/\/+$/, "");
}

function getHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const apiKey = process.env.EVER_JOBS_API_KEY;
  if (apiKey) {
    headers[process.env.EVER_JOBS_API_KEY_HEADER || "x-api-key"] = apiKey;
  }

  return headers;
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function searchEverJobs(input: EverJobsSearchRequest): Promise<EverJobsSearchResponse> {
  const url = new URL("/api/jobs/search", getBaseUrl());
  url.searchParams.set("dedup", "true");

  const response = await fetchWithTimeout(url.toString(), {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as EverJobsSearchResponse | { message?: string } | null;

  if (!response.ok) {
    const message =
      payload && "message" in payload && payload.message
        ? payload.message
        : `Ever Jobs request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!payload || !("jobs" in payload) || !Array.isArray(payload.jobs)) {
    throw new Error("Ever Jobs returned an unexpected response shape.");
  }

  return payload;
}
