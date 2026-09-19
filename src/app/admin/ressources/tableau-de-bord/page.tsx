import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RESOURCE_STATUS_LABELS, RESOURCE_TYPE_LABELS } from "@/lib/resources";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

export const metadata: Metadata = { title: "Tableau de bord CAMPUS RESSOURCES" };

export default async function ResourcesDashboardPage() {
  await requireEditor();

  const [
    totalResources,
    byType,
    byStatus,
    byNiveau,
    byDomaine,
    premiumCount,
    mostViewed,
    mostDownloaded,
    distinctSubjects,
  ] = await Promise.all([
    prisma.resource.count(),
    prisma.resource.groupBy({ by: ["type"], _count: true }),
    prisma.resource.groupBy({ by: ["status"], _count: true }),
    prisma.resource.groupBy({ by: ["niveauId"], _count: true, where: { niveauId: { not: null } } }),
    prisma.resource.groupBy({ by: ["domaineId"], _count: true, where: { domaineId: { not: null } } }),
    prisma.resource.count({ where: { isPremium: true } }),
    prisma.resource.findMany({
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { id: true, title: true, viewCount: true },
    }),
    prisma.resource.findMany({
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { id: true, title: true, downloadCount: true },
    }),
    prisma.resource.findMany({
      distinct: ["subjectId"],
      where: { subjectId: { not: null } },
      select: { subjectId: true },
    }),
  ]);

  const [allNiveaux, allDomaines] = await Promise.all([
    prisma.resourceCategory.findMany({ where: { kind: "NIVEAU" } }),
    prisma.resourceCategory.findMany({ where: { kind: "DOMAINE" } }),
  ]);
  const niveauNames = new Map(allNiveaux.map((c) => [c.id, c.name]));
  const domaineNames = new Map(allDomaines.map((c) => [c.id, c.name]));

  const totalViews = mostViewed.reduce((sum, r) => sum + r.viewCount, 0);
  const totalDownloads = mostDownloaded.reduce((sum, r) => sum + r.downloadCount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Ressources</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{totalResources}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{premiumCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Matières couvertes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{distinctSubjects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Par type</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {byType.map((t) => (
                <div key={t.type} className="flex justify-between">
                  <span className="text-neutral-600">{RESOURCE_TYPE_LABELS[t.type]}</span>
                  <span className="font-medium text-neutral-900">{t._count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {byNiveau.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-500">Par niveau</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                {byNiveau.map((n) => (
                  <div key={n.niveauId} className="flex justify-between">
                    <span className="text-neutral-600">
                      {niveauNames.get(n.niveauId as string) ?? "?"}
                    </span>
                    <span className="font-medium text-neutral-900">{n._count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {byDomaine.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-500">Par domaine</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 text-sm">
                {byDomaine.map((d) => (
                  <div key={d.domaineId} className="flex justify-between">
                    <span className="text-neutral-600">
                      {domaineNames.get(d.domaineId as string) ?? "?"}
                    </span>
                    <span className="font-medium text-neutral-900">{d._count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Qualité</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {byStatus.map((s) => (
            <Card key={s.status}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-500">
                  {RESOURCE_STATUS_LABELS[s.status]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-neutral-900">{s._count}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Utilisation</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">
                Ressources les plus vues {totalViews > 0 ? `(top 5, ${totalViews} vues)` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {mostViewed.every((r) => r.viewCount === 0) && (
                <p className="text-neutral-500">Pas encore de données.</p>
              )}
              {mostViewed
                .filter((r) => r.viewCount > 0)
                .map((r) => (
                  <div key={r.id} className="flex justify-between gap-2">
                    <span className="truncate text-neutral-600">{r.title}</span>
                    <span className="shrink-0 font-medium text-neutral-900">{r.viewCount}</span>
                  </div>
                ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">
                Ressources les plus téléchargées{" "}
                {totalDownloads > 0 ? `(top 5, ${totalDownloads} téléch.)` : ""}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {mostDownloaded.every((r) => r.downloadCount === 0) && (
                <p className="text-neutral-500">Pas encore de données.</p>
              )}
              {mostDownloaded
                .filter((r) => r.downloadCount > 0)
                .map((r) => (
                  <div key={r.id} className="flex justify-between gap-2">
                    <span className="truncate text-neutral-600">{r.title}</span>
                    <span className="shrink-0 font-medium text-neutral-900">
                      {r.downloadCount}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
