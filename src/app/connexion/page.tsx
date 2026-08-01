import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Connexion" };

export default function ConnexionPage() {
  return (
    <PlaceholderPage
      title="Connexion"
      description="L'espace utilisateur élève/étudiant arrive bientôt : profil, favoris, téléchargements et ressources gratuites."
      sprint="au Sprint 3"
    />
  );
}
