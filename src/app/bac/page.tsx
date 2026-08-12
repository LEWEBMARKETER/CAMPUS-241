import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "CAMPUS BAC" };

export default function BacPage() {
  return (
    <PlaceholderPage
      title="CAMPUS BAC"
      description="Simulez des épreuves du Baccalauréat en mode entraînement ou examen, et suivez votre progression chapitre par chapitre."
      sprint="au Sprint 6"
    />
  );
}
