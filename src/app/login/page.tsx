import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function LoginPage() {
  return (
    <AuthPageShell
      eyebrow="AlgoJob AI"
      title="Connexion à votre Espace"
      description="Accédez à la solution de Data Gathering intelligente AlgoJob AI pour collecter et traiter les offres d'emploi pertinentes en temps réel grâce à notre chatbot IA."
    >
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
