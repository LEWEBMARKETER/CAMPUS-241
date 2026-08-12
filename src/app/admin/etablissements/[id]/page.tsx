import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EstablishmentForm } from "@/components/admin/establishment-form";
import { updateEstablishment } from "@/lib/actions/admin-establishments";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Modifier l'établissement" };

export default async function EditEstablishmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { error } = await searchParams;

  const establishment = await prisma.establishment.findUnique({ where: { id } });
  if (!establishment) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Modifier {establishment.name}
      </h2>

      <div className="mt-4 max-w-2xl">
        <EstablishmentForm
          establishment={establishment}
          action={updateEstablishment.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
