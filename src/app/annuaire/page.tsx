import type { Metadata } from "next";
import type { EstablishmentLevel, Prisma, PublicOrPrivate } from "@prisma/client";

import { AnnuaireFilters } from "@/components/annuaire/annuaire-filters";
import { EstablishmentCard } from "@/components/establishment-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Annuaire des établissements" };

type SearchParams = {
  q?: string;
  type?: string;
  city?: string;
  niveau?: string;
  filiere?: string;
};

export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.EstablishmentWhereInput = { archived: false };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
      { filieresSuperieur: { has: params.q } },
    ];
  }
  if (params.type) {
    where.publicOrPrivate = params.type as PublicOrPrivate;
  }
  if (params.city) {
    where.city = params.city;
  }
  if (params.niveau) {
    where.levels = { has: params.niveau as EstablishmentLevel };
  }
  if (params.filiere) {
    where.filieresSuperieur = { has: params.filiere };
  }

  const [establishments, cityRows] = await Promise.all([
    prisma.establishment.findMany({
      where,
      orderBy: [{ verified: "desc" }, { name: "asc" }],
    }),
    prisma.establishment.findMany({
      distinct: ["city"],
      select: { city: true },
      where: { city: { not: null }, archived: false },
      orderBy: { city: "asc" },
    }),
  ]);

  const cities = cityRows
    .map((row) => row.city)
    .filter((city): city is string => Boolean(city));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        Annuaire des établissements
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Écoles primaires, collèges, lycées, universités et centres de formation, publics et privés,
        au Gabon.
      </p>

      <div className="mt-6">
        <AnnuaireFilters cities={cities} />
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        {establishments.length} établissement
        {establishments.length > 1 ? "s" : ""} trouvé
        {establishments.length > 1 ? "s" : ""}
      </p>

      {establishments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Aucun établissement ne correspond à ces critères pour le moment.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {establishments.map((establishment) => (
            <EstablishmentCard
              key={establishment.id}
              id={establishment.id}
              name={establishment.name}
              logoUrl={establishment.logoUrl}
              publicOrPrivate={establishment.publicOrPrivate}
              levels={establishment.levels}
              city={establishment.city}
              verified={establishment.verified}
              description={establishment.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
