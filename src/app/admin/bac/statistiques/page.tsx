import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteBacStatistic } from "@/lib/actions/admin-bac-statistics";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "Statistiques officielles BAC" };

export default async function AdminBacStatisticsPage() {
  await requireAdmin();
  const statistics = await prisma.bacStatistic.findMany({
    include: { series: true },
    orderBy: [{ year: "desc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {statistics.length} entrée{statistics.length > 1 ? "s" : ""}
        </p>
        <Button asChild size="sm">
          <Link href="/admin/bac/statistiques/nouveau">Ajouter une statistique</Link>
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Année</th>
              <th className="px-4 py-3">Série</th>
              <th className="px-4 py-3">Candidats</th>
              <th className="px-4 py-3">Taux de réussite</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat) => (
              <tr key={stat.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">{stat.year}</td>
                <td className="px-4 py-3 text-neutral-600">{stat.series?.code ?? "Toutes"}</td>
                <td className="px-4 py-3 text-neutral-600">{stat.candidatesCount ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {stat.passRate !== null ? `${stat.passRate}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      stat.status === "OFFICIEL"
                        ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                        : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                    }
                  >
                    {stat.status === "OFFICIEL" ? "Donnée officielle" : "Non disponible"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bac/statistiques/${stat.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteBacStatistic.bind(null, stat.id)}>
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
