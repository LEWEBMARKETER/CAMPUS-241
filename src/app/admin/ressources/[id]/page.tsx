import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceForm } from "@/components/admin/resource-form";
import { updateResource } from "@/lib/actions/admin-resources";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier la ressource" };

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [resource, niveaux, domaines, filieres, subjects] = await Promise.all([
    prisma.resource.findUnique({ where: { id } }),
    prisma.resourceCategory.findMany({ where: { kind: "NIVEAU" }, orderBy: { order: "asc" } }),
    prisma.resourceCategory.findMany({ where: { kind: "DOMAINE" }, orderBy: { order: "asc" } }),
    prisma.resourceCategory.findMany({ where: { kind: "FILIERE" }, orderBy: { order: "asc" } }),
    prisma.resourceSubject.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!resource) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier {resource.title}</h2>
      <div className="mt-4 max-w-xl">
        <ResourceForm
          resource={resource}
          niveaux={niveaux}
          domaines={domaines}
          filieres={filieres}
          subjects={subjects}
          action={updateResource.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
