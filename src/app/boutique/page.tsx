import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Boutique" };

export default function BoutiquePage() {
  return (
    <PlaceholderPage
      title="Boutique CAMPUS 241"
      description="Des produits digitaux (guides, méthodologies, ressources premium) pour réussir votre parcours scolaire."
      sprint="au Sprint 4"
    />
  );
}
