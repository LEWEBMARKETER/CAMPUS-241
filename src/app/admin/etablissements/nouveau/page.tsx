import type { Metadata } from "next";

import { EstablishmentForm } from "@/components/admin/establishment-form";
import { createEstablishment } from "@/lib/actions/admin-establishments";

export const metadata: Metadata = { title: "Nouvel établissement" };

export default async function NewEstablishmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Nouvel établissement
      </h2>
      <div className="mt-4 max-w-2xl">
        <EstablishmentForm action={createEstablishment} error={error} />
      </div>
    </div>
  );
}
