import type { Metadata } from "next";
import Link from "next/link";
import { Archive, ArchiveRestore, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteEstablishment,
  toggleArchived,
  toggleVerified,
} from "@/lib/actions/admin-establishments";
import { ESTABLISHMENT_LEVEL_LABELS, PUBLIC_PRIVATE_LABELS } from "@/lib/establishment";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Gestion des établissements" };

export default async function AdminEstablishmentsPage() {
  await requireAdmin();
  const establishments = await prisma.establishment.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {establishments.length} établissement
          {establishments.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/etablissements/nouveau">Nouvel établissement</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Niveaux</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Vérifié</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {establishments.map((establishment) => (
              <tr
                key={establishment.id}
                className={`border-b border-black/5 last:border-0 ${establishment.archived ? "opacity-50" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {establishment.name}
                  {establishment.archived && (
                    <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                      Archivé
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {PUBLIC_PRIVATE_LABELS[establishment.publicOrPrivate]}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {establishment.levels.map((level) => ESTABLISHMENT_LEVEL_LABELS[level]).join(", ")}
                </td>
                <td className="px-4 py-3 text-neutral-600">{establishment.city ?? "—"}</td>
                <td className="px-4 py-3">
                  <form
                    action={toggleVerified.bind(null, establishment.id, establishment.verified)}
                  >
                    <button
                      type="submit"
                      className={
                        establishment.verified
                          ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                          : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                      }
                    >
                      {establishment.verified ? "Vérifié" : "Non vérifié"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/etablissements/${establishment.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form
                      action={toggleArchived.bind(
                        null,
                        establishment.id,
                        establishment.archived,
                      )}
                    >
                      <Button type="submit" variant="outline" size="sm">
                        {establishment.archived ? (
                          <ArchiveRestore className="size-4" />
                        ) : (
                          <Archive className="size-4" />
                        )}
                      </Button>
                    </form>
                    <form action={deleteEstablishment.bind(null, establishment.id)}>
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
