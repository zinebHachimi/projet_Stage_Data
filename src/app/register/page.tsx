import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageShell } from "@/components/auth/AuthPageShell";

export default function RegisterPage() {
  return (
    <AuthPageShell
      eyebrow="Rejoindre la plateforme"
      title="Creer votre Compte AlgoJob AI"
      description="Inscrivez-vous gratuitement pour configurer vos alertes d'offres d'emploi, analyser les tendances du marche du travail et tirer parti du traitement automatique des donnees par IA."
    >
      <AuthForm mode="register" />
    </AuthPageShell>
  );
}
