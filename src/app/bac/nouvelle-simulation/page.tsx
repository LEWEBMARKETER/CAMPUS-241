import type { Metadata } from "next";

import { SimulationSetupForm } from "@/components/bac/simulation-setup-form";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Nouvelle simulation" };

export default async function NewSimulationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireUser();
  const { error } = await searchParams;

  const [allSeries, allSubjects, allChapters] = await Promise.all([
    prisma.series.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.subject.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { series: true },
    }),
    prisma.chapter.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900">Nouvelle simulation</h1>
      <p className="mt-2 text-neutral-600">
        Choisissez votre série, votre matière et le mode de simulation pour commencer.
      </p>

      <div className="mt-8">
        <SimulationSetupForm
          allSeries={allSeries.map((s) => ({ id: s.id, code: s.code, name: s.name }))}
          allSubjects={allSubjects.map((s) => ({
            id: s.id,
            name: s.name,
            seriesIds: s.series.map((ss) => ss.seriesId),
          }))}
          allChapters={allChapters.map((c) => ({
            id: c.id,
            name: c.name,
            subjectId: c.subjectId,
          }))}
          error={error}
        />
      </div>
    </div>
  );
}
