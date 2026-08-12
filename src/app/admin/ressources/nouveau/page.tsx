import type { Metadata } from "next";

import { ResourceForm } from "@/components/admin/resource-form";
import { createResource } from "@/lib/actions/admin-resources";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nouvelle ressource" };

export default async function NewResourcePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const [niveaux, domaines, filieres, subjects] = await Promise.all([
    prisma.resourceCategory.findMany({ where: { kind: "NIVEAU" }, orderBy: { order: "asc" } }),
    prisma.resourceCategory.findMany({ where: { kind: "DOMAINE" }, orderBy: { order: "asc" } }),
    prisma.resourceCategory.findMany({ where: { kind: "FILIERE" }, orderBy: { order: "asc" } }),
    prisma.resourceSubject.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle ressource</h2>
      <div className="mt-4 max-w-xl">
        <ResourceForm
          niveaux={niveaux}
          domaines={domaines}
          filieres={filieres}
          subjects={subjects}
          action={createResource}
          error={error}
        />
      </div>
    </div>
  );
}
