import type { Metadata } from "next";
import type { Prisma, EstablishmentType, PublicOrPrivate } from "@prisma/client";

import { AnnuaireFilters } from "@/components/annuaire/annuaire-filters";
import { EstablishmentCard } from "@/components/establishment-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Annuaire des établissements" };

type SearchParams = {
  q?: string;
  type?: string;
  city?: string;
  secteur?: string;
  filiere?: string;
  budget?: string;
};

export default async function AnnuairePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.EstablishmentWhereInput = { status: "ACTIVE" };

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { city: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.type) {
    where.type = params.type as EstablishmentType;
  }
  if (params.city) {
    where.city = params.city;
  }
  if (params.secteur) {
    where.publicOrPrivate = params.secteur as PublicOrPrivate;
  }
  if (params.filiere) {
    where.filieres = { has: params.filiere };
  }
  if (params.budget) {
    where.budgetRange = params.budget;
  }

  const [establishments, cityRows] = await Promise.all([
    prisma.establishment.findMany({
      where,
      orderBy: [{ isPartner: "desc" }, { name: "asc" }],
    }),
    prisma.establishment.findMany({
      distinct: ["city"],
      select: { city: true },
      where: { city: { not: null }, status: "ACTIVE" },
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
        Collèges, lycées, universités, grandes écoles et centres de formation
        en Afrique francophone.
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
              type={establishment.type}
              city={establishment.city}
              isPartner={establishment.isPartner}
              description={establishment.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
