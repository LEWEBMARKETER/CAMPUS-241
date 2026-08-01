import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Conseillers" };

export default function ConseillersPage() {
  return (
    <PlaceholderPage
      title="Conseillers pédagogiques"
      description="Trouvez un conseiller par spécialité et par ville, et prenez contact via WhatsApp ou Calendly."
      sprint="au Sprint 2"
    />
  );
}
