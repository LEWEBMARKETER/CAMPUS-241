import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

import { ConseillerFilters } from "@/components/conseillers/conseiller-filters";
import { ConseillerCard } from "@/components/conseiller-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Conseillers pédagogiques" };

export default async function ConseillersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string }>;
}) {
  const params = await searchParams;

  const where: Prisma.AdvisorWhereInput = {};
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { specialty: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.city) {
    where.city = params.city;
  }

  const [advisors, cityRows] = await Promise.all([
    prisma.advisor.findMany({ where, orderBy: { name: "asc" } }),
    prisma.advisor.findMany({
      distinct: ["city"],
      select: { city: true },
      where: { city: { not: null } },
      orderBy: { city: "asc" },
    }),
  ]);

  const cities = cityRows
    .map((row) => row.city)
    .filter((city): city is string => Boolean(city));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        Conseillers pédagogiques
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Trouvez un conseiller par spécialité et par ville, et prenez contact
        via WhatsApp ou rendez-vous.
      </p>

      <div className="mt-6">
        <ConseillerFilters cities={cities} />
      </div>

      {advisors.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Aucun conseiller ne correspond à ces critères pour le moment.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((advisor) => (
            <ConseillerCard
              key={advisor.id}
              id={advisor.id}
              name={advisor.name}
              specialty={advisor.specialty}
              city={advisor.city}
              bio={advisor.bio}
            />
          ))}
        </div>
      )}
    </div>
  );
}
