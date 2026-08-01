import type { Metadata } from "next";

import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Annuaire des établissements" };

export default function AnnuairePage() {
  return (
    <PlaceholderPage
      title="Annuaire des établissements"
      description="Collèges, lycées, universités, grandes écoles et centres de formation : recherchez par pays, ville, domaine, niveau et budget."
      sprint="au Sprint 2"
    />
  );
}
