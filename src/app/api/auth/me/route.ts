import { cookies } from "next/headers";
import { verifySession } from "@/features/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("agentic_session")?.value;
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
