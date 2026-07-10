import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/features/dashboard/dashboard-data";

export async function GET() {
  return NextResponse.json(await getDashboardMetrics());
}
