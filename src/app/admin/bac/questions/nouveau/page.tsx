import type { Metadata } from "next";

import { QuestionForm } from "@/components/admin/question-form";
import { createQuestion } from "@/lib/actions/admin-bac-questions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Nouvelle question" };

export default async function NewQuestionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const [allSeries, allSubjects, allChapters] = await Promise.all([
    prisma.series.findMany({ orderBy: { order: "asc" } }),
    prisma.subject.findMany({ orderBy: { order: "asc" } }),
    prisma.chapter.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle question</h2>
      <div className="mt-4 max-w-2xl">
        <QuestionForm
          allSeries={allSeries}
          allSubjects={allSubjects}
          allChapters={allChapters}
          action={createQuestion}
          error={error}
        />
      </div>
    </div>
  );
}
