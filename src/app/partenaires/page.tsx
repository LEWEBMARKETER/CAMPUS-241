import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Partenaires" };

export default function PartenairesPage() {
  return (
    <PlaceholderPage
      title="Nos partenaires"
      description="Établissements et acteurs éducatifs partenaires de CAMPUS 241."
      sprint="au Sprint 2"
    />
  );
}
