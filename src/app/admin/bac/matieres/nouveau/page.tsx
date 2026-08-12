import type { Metadata } from "next";

import { SubjectForm } from "@/components/admin/subject-form";
import { createSubject } from "@/lib/actions/admin-bac-subjects";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nouvelle matière" };

export default async function NewSubjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const allSeries = await prisma.series.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle matière</h2>
      <div className="mt-4 max-w-xl">
        <SubjectForm allSeries={allSeries} action={createSubject} error={error} />
      </div>
    </div>
  );
}
