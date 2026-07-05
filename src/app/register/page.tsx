import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function RegisterPage() {
  return (
    <AuthPageShell
      eyebrow="Workspace Setup"
      title="Create a clean command center for data gathering"
      description="Register once, then connect agentic collection workflows to dashboards, history, and structured MongoDB records."
    >
      <AuthForm mode="register" />
    </AuthPageShell>
  );
}
