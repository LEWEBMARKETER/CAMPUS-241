import type { Metadata } from "next";

import { ResourceCategoryForm } from "@/components/admin/resource-category-form";
import { createResourceCategory } from "@/lib/actions/admin-resource-categories";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nouvelle catégorie" };

export default async function NewResourceCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const domaines = await prisma.resourceCategory.findMany({
    where: { kind: "DOMAINE" },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle catégorie</h2>
      <div className="mt-4 max-w-xl">
        <ResourceCategoryForm domaines={domaines} action={createResourceCategory} error={error} />
      </div>
    </div>
  );
}
