import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Inscription" };

export default function InscriptionPage() {
  return (
    <PlaceholderPage
      title="Créer mon compte"
      description="L'inscription élève/étudiant (nom, email, WhatsApp, niveau, ville...) arrive bientôt."
      sprint="au Sprint 3"
    />
  );
}
