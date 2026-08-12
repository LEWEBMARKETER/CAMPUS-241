import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteSeries } from "@/lib/actions/admin-bac-series";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Séries BAC" };

export default async function AdminSeriesPage() {
  const series = await prisma.series.findMany({ orderBy: [{ country: "asc" }, { order: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {series.length} série{series.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/bac/series/nouveau">Nouvelle série</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Pays</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{s.code}</td>
                <td className="px-4 py-3 text-neutral-600">{s.name}</td>
                <td className="px-4 py-3 text-neutral-600">{s.country}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      s.isActive
                        ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                        : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                    }
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bac/series/${s.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteSeries.bind(null, s.id)}>
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
