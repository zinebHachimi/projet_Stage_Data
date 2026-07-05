import { NextResponse } from "next/server";
import { dashboardMetrics } from "@/features/dashboard/dashboard-data";

export async function GET() {
  return NextResponse.json(dashboardMetrics);
}
