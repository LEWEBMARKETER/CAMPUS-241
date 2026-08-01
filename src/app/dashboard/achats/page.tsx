import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mes achats" };

export default function AchatsPage() {
  return (
    <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
      Le suivi de vos achats de produits digitaux sera disponible avec
      l&apos;ouverture de la boutique (Sprint 4).
    </div>
  );
}
