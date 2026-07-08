import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function LoginPage() {
  return (
    <AuthPageShell
      eyebrow="AlgoJob AI"
      title="Connexion a votre Espace"
      description="Accedez a la solution de Data Gathering intelligente AlgoJob AI pour collecter et traiter les offres d'emploi pertinentes en temps reel grace a notre chatbot IA."
    >
      <AuthForm mode="login" />
    </AuthPageShell>
  );
}
