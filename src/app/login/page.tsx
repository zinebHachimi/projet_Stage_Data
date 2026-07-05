import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function LoginPage() {
  return (
    <AuthPageShell
      eyebrow="Secure Access"
      title="Return to your intelligence cockpit"
      description="Sign in to review gathered offers, continue natural language queries, and keep your workspace history organized."
    >
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
