import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";
import type { PublicUser } from "@/types/api";
import type { ValidAuthPayload } from "./auth-validation";
import { hashPassword, verifyPassword } from "./password";

export type AuthServiceResult =
  | { ok: true; user: PublicUser }
  | { ok: false; status: 401 | 409; message: string };

type UserDocument = {
  _id: ObjectId;
  email: string;
  name?: string | null;
  passwordHash?: string | null;
  role?: string;
  workspaceSlug?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export async function authenticate(payload: ValidAuthPayload): Promise<AuthServiceResult> {
  const users = getMongoDb().collection<UserDocument>("User");

  if (payload.action === "register") {
    const existingUser = await users.findOne({ email: payload.email });

    if (existingUser) {
      return {
        ok: false,
        status: 409,
        message: "An account already exists for this email. Login instead.",
      };
    }

    const workspaceSlug =
      payload.email
        .split("@")[0]
        ?.replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "default";

    const now = new Date();
    const user: UserDocument = {
      _id: new ObjectId(),
      email: payload.email,
      name: payload.name,
      passwordHash: hashPassword(payload.password),
      role: "VIEWER",
      workspaceSlug,
      createdAt: now,
      updatedAt: now,
    };

    await users.insertOne(user);

    return {
      ok: true,
      user: { id: user._id.toHexString(), email: user.email, name: user.name ?? null, role: user.role ?? "VIEWER" },
    };
  }

  const user = await users.findOne({
    email: payload.email,
  });

  if (!user?.passwordHash || !verifyPassword(payload.password, user.passwordHash)) {
    return { ok: false, status: 401, message: "Invalid email or password." };
  }

  return {
    ok: true,
    user: { id: user._id.toHexString(), email: user.email, name: user.name ?? null, role: user.role ?? "VIEWER" },
  };
}
