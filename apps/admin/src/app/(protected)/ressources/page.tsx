import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ArchiveRestore, Pencil, Send, Trash2 } from "lucide-react";

import { Button } from "@campus241/shared/ui/button";
import {
  archiveResource,
  deleteResource,
  togglePremium,
  unarchiveResource,
} from "@/lib/actions/admin-resources";
import { publishResource, submitResourceForValidation, unpublishResource } from "@/lib/actions/admin-resources-validation";
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS } from "@campus241/shared/resources";
import { prisma } from "@campus241/shared/prisma";

export const metadata: Metadata = { title: "Ressources" };

const STATUS_BADGE_CLASS: Record<string, string> = {
  PUBLIE: "bg-brand-green-light text-brand-green-dark",
  VALIDE: "bg-brand-blue-light text-brand-blue",
  EN_ATTENTE: "bg-amber-100 text-amber-700",
  BROUILLON: "bg-neutral-100 text-neutral-500",
  ARCHIVE: "bg-neutral-100 text-neutral-400",
};

export default async function AdminResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { status, error } = await searchParams;

  const resources = await prisma.resource.findMany({
    where: { status: (status as never) || undefined },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex items-center gap-2">
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(RESOURCE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">
            Filtrer
          </Button>
        </form>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/ressources/importer">Import CSV</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/ressources/nouveau">Nouvelle ressource</Link>
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <p className="mt-3 text-sm text-neutral-500">
        {resources.length} ressource{resources.length > 1 ? "s" : ""} (100 max affichées)
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Premium</th>
              <th className="px-4 py-3">Vues / Téléch.</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b border-black/5 last:border-0">
                <td className="max-w-xs truncate px-4 py-3 font-medium text-neutral-900">
                  {resource.title}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {RESOURCE_TYPE_LABELS[resource.type]}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[resource.status]}`}
                  >
                    {RESOURCE_STATUS_LABELS[resource.status]}
                  </span>
                  <div className="mt-1 flex flex-col gap-0.5">
                    {resource.status === "BROUILLON" && (
                      <form action={submitResourceForValidation.bind(null, resource.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-1 text-xs font-medium text-brand-blue hover:underline"
                        >
                          <Send className="size-3" />
                          Soumettre
                        </button>
                      </form>
                    )}
                    {resource.status === "VALIDE" && (
                      <form action={publishResource.bind(null, resource.id)}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-brand-green-dark hover:underline"
                        >
                          Publier
                        </button>
                      </form>
                    )}
                    {resource.status === "PUBLIE" && (
                      <form action={unpublishResource.bind(null, resource.id)}>
                        <button type="submit" className="text-xs font-medium text-neutral-500 hover:underline">
                          Dépublier
                        </button>
                      </form>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <form action={togglePremium.bind(null, resource.id, resource.isPremium)}>
                    <button
                      type="submit"
                      className={
                        resource.isPremium
                          ? "rounded-full bg-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-blue"
                          : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                      }
                    >
                      {resource.isPremium ? "Premium" : "Gratuit"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {resource.viewCount} / {resource.downloadCount}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/ressources/${resource.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form
                      action={(resource.status === "ARCHIVE" ? unarchiveResource : archiveResource).bind(
                        null,
                        resource.id,
                      )}
                    >
                      <Button type="submit" variant="outline" size="sm">
                        {resource.status === "ARCHIVE" ? (
                          <ArchiveRestore className="size-4" />
                        ) : (
                          <Archive className="size-4" />
                        )}
                      </Button>
                    </form>
                    <form action={deleteResource.bind(null, resource.id)}>
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
