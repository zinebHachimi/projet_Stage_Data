// @ts-nocheck
import { cookies } from "next/headers";
import { verifySession } from "@/features/auth/session";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const token = (await cookies()).get("agentic_session")?.value;
  if (!token) return null;
  const session = await verifySession(token);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });
  return user;
}
