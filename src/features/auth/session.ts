import { NextResponse } from "next/server";
import type { PublicUser } from "@/types/api";

export function createSessionResponse(user: PublicUser) {
  const response = NextResponse.json({ user });

  response.cookies.set({
    name: "agentic_session",
    value: Buffer.from(
      JSON.stringify({
        userId: user.id,
        email: user.email,
        issuedAt: Date.now(),
      }),
    ).toString("base64url"),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
