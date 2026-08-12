import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuestionForm } from "@/components/admin/question-form";
import { updateQuestion } from "@/lib/actions/admin-bac-questions";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier la question" };

export default async function EditQuestionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const [question, allSeries, allSubjects, allChapters] = await Promise.all([
    prisma.question.findUnique({ where: { id }, include: { choices: { orderBy: { order: "asc" } } } }),
    prisma.series.findMany({ orderBy: { order: "asc" } }),
    prisma.subject.findMany({ orderBy: { order: "asc" } }),
    prisma.chapter.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!question) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier la question</h2>
      <div className="mt-4 max-w-2xl">
        <QuestionForm
          question={question}
          choices={question.choices}
          allSeries={allSeries}
          allSubjects={allSubjects}
          allChapters={allChapters}
          action={updateQuestion.bind(null, id)}
          error={error}
        />
      </div>
    </div>
  );
}
