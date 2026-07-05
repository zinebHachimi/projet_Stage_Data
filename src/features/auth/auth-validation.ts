import type { AuthMode, AuthRequest } from "@/types/api";

export type ValidAuthPayload = {
  action: AuthMode;
  email: string;
  password: string;
  name: string;
};

export type ValidationResult =
  | { ok: true; value: ValidAuthPayload }
  | { ok: false; message: string; status: 400 };

export function normalizeEmail(email: unknown) {
  return String(email ?? "").trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateAuthPayload(payload: AuthRequest): ValidationResult {
  const action = payload.action;
  const email = normalizeEmail(payload.email);
  const password = String(payload.password ?? "");
  const name = String(payload.name ?? "").trim();

  if (action !== "login" && action !== "register") {
    return { ok: false, message: "Unsupported authentication action.", status: 400 };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Enter a valid email address.", status: 400 };
  }

  if (password.length < 8) {
    return {
      ok: false,
      message: "Password must contain at least 8 characters.",
      status: 400,
    };
  }

  if (action === "register" && name.length < 2) {
    return { ok: false, message: "Enter your full name.", status: 400 };
  }

  return { ok: true, value: { action, email, password, name } };
}
