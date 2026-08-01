import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Ressources" };

export default function RessourcesPage() {
  return (
    <PlaceholderPage
      title="Ressources pédagogiques"
      description="Blog, révisions Bac 2026, méthodologie, vie étudiante et conseils aux parents."
      sprint="au Sprint 4"
    />
  );
}
