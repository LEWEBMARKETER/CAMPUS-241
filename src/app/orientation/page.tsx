import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Orientation" };

export default function OrientationPage() {
  return (
    <PlaceholderPage
      title="Orientation scolaire et universitaire"
      description="Conseils d'orientation, guides gratuits à télécharger et, bientôt, un quiz d'orientation intelligent."
      sprint="au Sprint 2"
    />
  );
}
