import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "CAMPUS RESSOURCES" };

export default function RessourcesPage() {
  return (
    <PlaceholderPage
      title="CAMPUS RESSOURCES"
      description="Cours, fiches de révision, annales, exercices et supports pédagogiques classés par niveau, domaine et filière — gratuits ou premium."
      sprint="au Sprint 7"
    />
  );
}
