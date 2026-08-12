import type { Metadata } from "next";
import type { Prisma, ResourceType } from "@prisma/client";

import { ResourceFilters } from "@/components/ressources/resource-filters";
import { ResourceCard } from "@/components/ressources/resource-card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Ressources" };

type SearchParams = {
  q?: string;
  type?: string;
  niveauId?: string;
  domaineId?: string;
  filiereId?: string;
  subjectId?: string;
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.ResourceWhereInput = { status: "PUBLIE" };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.type) {
    where.type = params.type as ResourceType;
  }
  if (params.niveauId) {
    where.niveauId = params.niveauId;
  }
  if (params.domaineId) {
    where.domaineId = params.domaineId;
  }
  if (params.filiereId) {
    where.filiereId = params.filiereId;
  }
  if (params.subjectId) {
    where.subjectId = params.subjectId;
  }

  const [resources, niveaux, domaines, filieres, subjects] = await Promise.all([
    prisma.resource.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { niveau: true, subject: true },
    }),
    prisma.resourceCategory.findMany({ where: { kind: "NIVEAU" }, orderBy: { order: "asc" } }),
    prisma.resourceCategory.findMany({ where: { kind: "DOMAINE" }, orderBy: { order: "asc" } }),
    prisma.resourceCategory.findMany({ where: { kind: "FILIERE" }, orderBy: { order: "asc" } }),
    prisma.resourceSubject.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">CAMPUS RESSOURCES</h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Cours, fiches de révision, annales et supports pédagogiques pour tous les niveaux.
      </p>

      <div className="mt-6">
        <ResourceFilters niveaux={niveaux} domaines={domaines} filieres={filieres} subjects={subjects} />
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        {resources.length} ressource{resources.length > 1 ? "s" : ""} trouvée
        {resources.length > 1 ? "s" : ""}
      </p>

      {resources.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Aucune ressource ne correspond à ces critères pour le moment.
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              slug={resource.slug}
              title={resource.title}
              type={resource.type}
              isPremium={resource.isPremium}
              niveauName={resource.niveau?.name}
              matiereName={resource.subject?.name}
              description={resource.description}
            />
          ))}
        </div>
      )}
    </div>
  );
}
