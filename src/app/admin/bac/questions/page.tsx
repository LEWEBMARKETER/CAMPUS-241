import type { Metadata } from "next";
import Link from "next/link";
import { Pencil, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteQuestion, togglePublished } from "@/lib/actions/admin-bac-questions";
import { submitForValidation } from "@/lib/actions/admin-bac-validation";
import {
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_TYPE_LABELS,
  QUESTION_VALIDATION_STATUS_LABELS,
} from "@/lib/bac";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Questions BAC" };

const VALIDATION_BADGE_CLASS: Record<string, string> = {
  VALIDEE: "bg-brand-green-light text-brand-green-dark",
  EN_ATTENTE_VALIDATION: "bg-amber-100 text-amber-700",
  A_CORRIGER: "bg-amber-100 text-amber-700",
  REJETEE: "bg-red-100 text-red-700",
  BROUILLON: "bg-neutral-100 text-neutral-500",
};

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; chapterId?: string; error?: string }>;
}) {
  const { subjectId, chapterId, error } = await searchParams;

  const [questions, subjects] = await Promise.all([
    prisma.question.findMany({
      where: {
        subjectId: subjectId || undefined,
        chapterId: chapterId || undefined,
      },
      orderBy: { createdAt: "desc" },
      include: { subject: true, chapter: true, series: true },
      take: 100,
    }),
    prisma.subject.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <form className="flex items-center gap-2">
          <select
            name="subjectId"
            defaultValue={subjectId ?? ""}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          >
            <option value="">Toutes les matières</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          <Button type="submit" variant="outline" size="sm">
            Filtrer
          </Button>
        </form>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/bac/questions/importer">Import CSV</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/bac/questions/nouveau">Nouvelle question</Link>
          </Button>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <p className="mt-3 text-sm text-neutral-500">
        {questions.length} question{questions.length > 1 ? "s" : ""} (100 max affichées)
      </p>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Énoncé</th>
              <th className="px-4 py-3">Série</th>
              <th className="px-4 py-3">Matière / Chapitre</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Difficulté</th>
              <th className="px-4 py-3">Validation</th>
              <th className="px-4 py-3">Publiée</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-b border-black/5 last:border-0">
                <td className="max-w-xs truncate px-4 py-3 font-medium text-neutral-900">
                  {question.prompt}
                </td>
                <td className="px-4 py-3 text-neutral-600">{question.series.code}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {question.subject.name} / {question.chapter.name}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {QUESTION_TYPE_LABELS[question.type]}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {QUESTION_DIFFICULTY_LABELS[question.difficulty]}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${VALIDATION_BADGE_CLASS[question.validationStatus]}`}
                  >
                    {QUESTION_VALIDATION_STATUS_LABELS[question.validationStatus]}
                  </span>
                  {(question.validationStatus === "BROUILLON" ||
                    question.validationStatus === "A_CORRIGER") && (
                    <form action={submitForValidation.bind(null, question.id)} className="mt-1">
                      <button
                        type="submit"
                        className="flex items-center gap-1 text-xs font-medium text-brand-blue hover:underline"
                      >
                        <Send className="size-3" />
                        Soumettre
                      </button>
                    </form>
                  )}
                </td>
                <td className="px-4 py-3">
                  <form action={togglePublished.bind(null, question.id, question.published)}>
                    <button
                      type="submit"
                      className={
                        question.published
                          ? "rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark"
                          : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500"
                      }
                    >
                      {question.published ? "Publiée" : "Non publiée"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/bac/questions/${question.id}`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
                    <form action={deleteQuestion.bind(null, question.id)}>
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
