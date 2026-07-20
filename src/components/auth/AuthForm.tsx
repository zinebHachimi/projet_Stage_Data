"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AuthMode } from "@/types/api";
import { Button } from "@/components/ui/Button";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthErrorResponse = {
  error?: {
    message?: string;
  };
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function checkPasswordStrength(pass: string): string | null {
    if (pass.length < 8) return "Le mot de passe doit contenir au moins 8 caracteres.";
    if (!/[A-Z]/.test(pass)) return "Le mot de passe doit contenir au moins une lettre majuscule (A-Z).";
    if (!/[a-z]/.test(pass)) return "Le mot de passe doit contenir au moins une lettre minuscule (a-z).";
    if (!/\d/.test(pass)) return "Le mot de passe doit contenir au moins un chiffre (0-9).";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      return "Le mot de passe doit contenir au moins un caractere special (ex: !, @, #, $, etc.).";
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === "register") {
      if (name.trim().length < 2) {
        setError("Veuillez saisir votre nom complet (minimum 2 caracteres).");
        return;
      }

      const strengthError = checkPasswordStrength(password);
      if (strengthError) {
        setError(strengthError);
        return;
      }

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    setIsPending(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          confirmPassword: mode === "register" ? confirmPassword : undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error?.message ?? "Une erreur d'authentification est survenue.");
        return;
      }

      const role = data.user?.role;
      if (role === "VIEWER") {
        router.replace("/admin/profile");
      } else {
        router.replace("/admin");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Le service d'authentification est momentanement indisponible.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-100">
      <h3 className="font-weight-bold mb-4 text-center" style={{ color: "#0f172a", fontSize: "24px" }}>
        {mode === "login" ? "Connexion a votre espace" : "Creation de compte candidat"}
      </h3>

      <form onSubmit={handleSubmit} className="d-flex flex-column" style={{ gap: "20px" }}>
        {mode === "register" ? (
          <div className="form-group text-left mb-0">
            <label className="auth-label">
              <i className="fa-solid fa-user mr-2 text-info"></i> Nom Complet
            </label>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Ex: Mohamed Alami"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="auth-input"
            />
          </div>
        ) : null}

        <div className="form-group text-left mb-0">
          <label className="auth-label">
            <i className="fa-solid fa-envelope mr-2 text-info"></i> Adresse Email
          </label>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="alami@recrutement.ma"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="auth-input"
          />
        </div>

        <div className="form-group text-left mb-0">
          <label className="auth-label">
            <i className="fa-solid fa-lock mr-2 text-info"></i> Mot de passe
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input"
          />
        </div>

        {mode === "register" ? (
          <div className="form-group text-left mb-0">
            <label className="auth-label">
              <i className="fa-solid fa-lock mr-2 text-info"></i> Confirmer le mot de passe
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="********"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="auth-input"
            />
          </div>
        ) : null}

        {error ? (
          <div
            className="p-3 text-left border rounded-3"
            style={{
              fontSize: "14px",
              backgroundColor: "#fef2f2",
              borderColor: "#fca5a5",
              color: "#991b1b",
            }}
          >
            <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
          </div>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          disabled={isPending}
          className="w-100 text-center font-weight-700 py-3 mt-2 border-0"
          style={{
            borderRadius: "12px",
            cursor: isPending ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? (
            <span>
              <i className="fa-solid fa-spinner fa-spin mr-2"></i> Traitement...
            </span>
          ) : mode === "login" ? (
            "Se Connecter"
          ) : (
            "Creer mon Espace"
          )}
        </Button>
      </form>

      <div className="text-center mt-4">
        {mode === "login" ? (
          <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
            Pas encore inscrit ?{" "}
            <Link href="/register" className="font-weight-700 text-info text-decoration-none">
              Creer un compte candidat
            </Link>
          </p>
        ) : (
          <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
            Deja un espace candidat ?{" "}
            <Link href="/login" className="font-weight-700 text-info text-decoration-none">
              Se connecter
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
