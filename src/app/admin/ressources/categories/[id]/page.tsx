import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResourceCategoryForm } from "@/components/admin/resource-category-form";
import { updateResourceCategory } from "@/lib/actions/admin-resource-categories";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier la catégorie" };

export default async function EditResourceCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const category = await prisma.resourceCategory.findUnique({ where: { id } });
  if (!category) {
    notFound();
  }

  const domaines = await prisma.resourceCategory.findMany({
    where: { kind: "DOMAINE" },
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier {category.name}</h2>
      <div className="mt-4 max-w-xl">
        <ResourceCategoryForm
          category={category}
          domaines={domaines}
          action={updateResourceCategory.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
