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

export function getPasswordStrengthError(password: string): string | null {
  if (password.length < 8) {
    return "Password must contain at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter (A-Z).";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter (a-z).";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number (0-9).";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character (for example: !, @, #, $, %).";
  }
  return null;
}

export function validateAuthPayload(payload: AuthRequest): ValidationResult {
  const action = payload.action;
  const email = normalizeEmail(payload.email);
  const password = String(payload.password ?? "");
  const name = String(payload.name ?? "").trim();
  const confirmPassword = String(payload.confirmPassword ?? "");

  if (action !== "login" && action !== "register") {
    return { ok: false, message: "Unsupported authentication action.", status: 400 };
  }

  if (!email) {
    return { ok: false, message: "Email is required.", status: 400 };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Please enter a valid email address.", status: 400 };
  }

  if (!password) {
    return { ok: false, message: "Password is required.", status: 400 };
  }

  if (action === "register") {
    if (name.length < 2) {
      return { ok: false, message: "Please enter your full name (at least 2 characters).", status: 400 };
    }

    const passwordError = getPasswordStrengthError(password);
    if (passwordError) {
      return { ok: false, message: passwordError, status: 400 };
    }

    if (password !== confirmPassword) {
      return { ok: false, message: "Passwords do not match.", status: 400 };
    }
  }

  return { ok: true, value: { action, email, password, name } };
}
