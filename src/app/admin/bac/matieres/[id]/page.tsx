import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SubjectForm } from "@/components/admin/subject-form";
import { updateSubject } from "@/lib/actions/admin-bac-subjects";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier la matière" };

export default async function EditSubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [subject, allSeries] = await Promise.all([
    prisma.subject.findUnique({ where: { id }, include: { series: true } }),
    prisma.series.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!subject) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier {subject.name}</h2>
      <div className="mt-4 max-w-xl">
        <SubjectForm
          subject={subject}
          selectedSeriesIds={subject.series.map((s) => s.seriesId)}
          allSeries={allSeries}
          action={updateSubject.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
