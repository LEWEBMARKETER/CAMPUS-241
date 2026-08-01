import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteEstablishment,
  togglePartnerStatus,
} from "@/lib/actions/admin-establishments";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishment";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Gestion des établissements" };

export default async function AdminEstablishmentsPage() {
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
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Partenaire</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {establishments.map((establishment) => (
              <tr key={establishment.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {establishment.name}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {ESTABLISHMENT_TYPE_LABELS[establishment.type]}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {establishment.city ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <form
                    action={togglePartnerStatus.bind(
                      null,
                      establishment.id,
                      establishment.isPartner,
                    )}
                  >
                    <button
                      type="submit"
                      className={
                        establishment.isPartner
                          ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                          : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                      }
                    >
                      {establishment.isPartner ? "Oui" : "Non"}
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
