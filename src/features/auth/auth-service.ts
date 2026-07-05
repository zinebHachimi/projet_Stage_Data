import { prisma } from "@/lib/prisma";
import type { PublicUser } from "@/types/api";
import type { ValidAuthPayload } from "./auth-validation";
import { hashPassword, verifyPassword } from "./password";

export type AuthServiceResult =
  | { ok: true; user: PublicUser }
  | { ok: false; status: 401 | 409; message: string };

export async function authenticate(payload: ValidAuthPayload): Promise<AuthServiceResult> {
  if (payload.action === "register") {
    const existingUser = await prisma.user.findUnique({ where: { email: payload.email } });

    if (existingUser) {
      return {
        ok: false,
        status: 409,
        message: "An account already exists for this email. Login instead.",
      };
    }

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.name,
        passwordHash: hashPassword(payload.password),
        workspaceSlug:
          payload.email.split("@")[0]?.replace(/[^a-z0-9-]/g, "-") || "default",
      },
    });

    return {
      ok: true,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  const user = await prisma.user.findUnique({ where: { email: payload.email } });

  if (!user?.passwordHash || !verifyPassword(payload.password, user.passwordHash)) {
    return { ok: false, status: 401, message: "Invalid email or password." };
  }

  return {
    ok: true,
    user: { id: user.id, email: user.email, name: user.name },
  };
}
