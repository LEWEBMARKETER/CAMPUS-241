import type { Metadata } from "next";
import Link from "next/link";
import { Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "CAMPUS BAC" };

export default async function DashboardBacPage() {
  const sessionUser = await requireUser();

  const [user, simulations, userBadges] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } }),
    prisma.simulation.findMany({
      where: { userId: sessionUser.id, status: "TERMINEE" },
      include: { series: true, subject: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userBadge.findMany({
      where: { userId: sessionUser.id },
      include: { badge: true },
      orderBy: { earnedAt: "desc" },
    }),
  ]);

  const lastSimulation = simulations[0];
  const previousScore = simulations[1]?.score ?? null;
  const progression =
    lastSimulation && previousScore !== null
      ? Math.round((lastSimulation.score ?? 0) - previousScore)
      : null;

  const bySubject = new Map<string, { name: string; total: number; sum: number }>();
  for (const sim of simulations) {
    const entry = bySubject.get(sim.subjectId) ?? { name: sim.subject.name, total: 0, sum: 0 };
    entry.total += 1;
    entry.sum += sim.score ?? 0;
    bySubject.set(sim.subjectId, entry);
  }
  const subjectAverages = Array.from(bySubject.values()).map((s) => ({
    name: s.name,
    average: Math.round(s.sum / s.total),
  }));

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardContent className="pt-6">
          <p className="text-lg font-semibold text-neutral-900">
            Bonjour {user.prenom} 👋
          </p>
          <p className="mt-1 text-sm text-neutral-600">
            {user.serie ? `Série : ${user.serie}` : "Aucune série renseignée dans votre profil."}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Dernier score</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                {lastSimulation ? `${Math.round(lastSimulation.score ?? 0)}%` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Progression</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">
                {progression === null ? "—" : `${progression > 0 ? "+" : ""}${progression}%`}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-neutral-500">Simulations</p>
              <p className="mt-1 text-2xl font-bold text-neutral-900">{simulations.length}</p>
            </div>
          </div>

          {subjectAverages.length > 0 && (
            <div className="mt-6 flex flex-col gap-2 border-t border-black/5 pt-4">
              {subjectAverages.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">{s.name}</span>
                  <span className="font-medium text-neutral-900">{s.average}%</span>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-2">
            <Button asChild>
              <Link href="/bac/nouvelle-simulation">Nouvelle simulation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {userBadges.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Mes badges</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {userBadges.map(({ badge }) => (
              <Card key={badge.id}>
                <CardContent className="flex flex-col items-center gap-2 pt-5 text-center">
                  <Award className="size-6 text-brand-gold" />
                  <p className="text-sm font-medium text-neutral-900">{badge.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Historique des simulations</h2>
        {simulations.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
            Aucune simulation terminée pour le moment.
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-black/5 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Série</th>
                  <th className="px-4 py-3">Matière</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {simulations.map((sim) => (
                  <tr key={sim.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 text-neutral-600">
                      {new Intl.DateTimeFormat("fr-FR").format(sim.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{sim.series.code}</td>
                    <td className="px-4 py-3 text-neutral-600">{sim.subject.name}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {sim.mode === "EXAMEN" ? "Examen" : "Entraînement"}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/bac/simulations/${sim.id}/resultats`}
                        className="font-medium text-brand-blue hover:underline"
                      >
                        {Math.round(sim.score ?? 0)}%
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
