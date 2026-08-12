import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteResourceCategory } from "@/lib/actions/admin-resource-categories";
import { RESOURCE_CATEGORY_KIND_LABELS } from "@/lib/resources";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Catégories de ressources" };

export default async function AdminResourceCategoriesPage() {
  const categories = await prisma.resourceCategory.findMany({
    orderBy: [{ kind: "asc" }, { order: "asc" }],
    include: { parent: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {categories.length} catégorie{categories.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/ressources/categories/nouveau">Nouvelle catégorie</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{category.name}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {RESOURCE_CATEGORY_KIND_LABELS[category.kind]}
                </td>
                <td className="px-4 py-3 text-neutral-600">{category.parent?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      category.isActive
                        ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                        : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                    }
                  >
                    {category.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/ressources/categories/${category.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteResourceCategory.bind(null, category.id)}>
                      <Button type="submit" variant="outline" size="sm">
                        <Trash2 className="size-4" />
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
