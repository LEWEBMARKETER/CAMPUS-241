import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_VALIDATION_STATUS_LABELS,
} from "@/lib/bac";
import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

export const metadata: Metadata = { title: "Tableau de bord CAMPUS BAC" };

export default async function BacDashboardPage() {
  await requireEditor();

  const [
    totalQuestions,
    bySeries,
    bySubject,
    byChapter,
    byDifficulty,
    byValidationStatus,
    distinctYears,
    distinctSourcedSubjects,
    distinctSeriesWithQuestions,
    officialCount,
    answers,
  ] = await Promise.all([
    prisma.question.count(),
    prisma.question.groupBy({ by: ["seriesId"], _count: true }),
    prisma.question.groupBy({ by: ["subjectId"], _count: true }),
    prisma.question.groupBy({ by: ["chapterId"], _count: true, orderBy: { _count: { chapterId: "desc" } }, take: 10 }),
    prisma.question.groupBy({ by: ["difficulty"], _count: true }),
    prisma.question.groupBy({ by: ["validationStatus"], _count: true }),
    prisma.question.findMany({ distinct: ["examYear"], where: { examYear: { not: null } }, select: { examYear: true } }),
    prisma.question.findMany({ distinct: ["subjectId"], where: { source: { not: null } }, select: { subjectId: true } }),
    prisma.question.findMany({ distinct: ["seriesId"], select: { seriesId: true } }),
    prisma.question.count({ where: { sourceStatus: "OFFICIEL" } }),
    prisma.simulationAnswer.findMany({
      where: { OR: [{ answerText: { not: null } }, { selectedChoiceIds: { isEmpty: false } }] },
      select: {
        questionId: true,
        isCorrect: true,
        question: {
          select: {
            prompt: true,
            chapterId: true,
            chapter: { select: { name: true } },
            subjectId: true,
            subject: { select: { name: true } },
          },
        },
      },
      take: 5000,
    }),
  ]);

  const [allSeries, allSubjects, allChapters] = await Promise.all([
    prisma.series.findMany(),
    prisma.subject.findMany(),
    prisma.chapter.findMany(),
  ]);
  const seriesNames = new Map(allSeries.map((s) => [s.id, s.code]));
  const subjectNames = new Map(allSubjects.map((s) => [s.id, s.name]));
  const chapterNames = new Map(allChapters.map((c) => [c.id, c.name]));

  // --- Utilisation : par question ---
  const byQuestion = new Map<string, { prompt: string; total: number; incorrect: number }>();
  for (const answer of answers) {
    const entry = byQuestion.get(answer.questionId) ?? {
      prompt: answer.question.prompt,
      total: 0,
      incorrect: 0,
    };
    entry.total += 1;
    if (answer.isCorrect === false) entry.incorrect += 1;
    byQuestion.set(answer.questionId, entry);
  }
  const mostAnswered = Array.from(byQuestion.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
  const highestErrorRate = Array.from(byQuestion.values())
    .filter((q) => q.total >= 3)
    .map((q) => ({ ...q, errorRate: Math.round((q.incorrect / q.total) * 100) }))
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 5);

  // --- Utilisation : par chapitre ---
  const byChapterUsage = new Map<string, { name: string; total: number; correct: number }>();
  const bySubjectUsage = new Map<string, { name: string; total: number }>();
  for (const answer of answers) {
    const chEntry = byChapterUsage.get(answer.question.chapterId) ?? {
      name: answer.question.chapter.name,
      total: 0,
      correct: 0,
    };
    chEntry.total += 1;
    if (answer.isCorrect) chEntry.correct += 1;
    byChapterUsage.set(answer.question.chapterId, chEntry);

    const subEntry = bySubjectUsage.get(answer.question.subjectId) ?? {
      name: answer.question.subject.name,
      total: 0,
    };
    subEntry.total += 1;
    bySubjectUsage.set(answer.question.subjectId, subEntry);
  }
  const hardestChapters = Array.from(byChapterUsage.values())
    .filter((c) => c.total >= 3)
    .map((c) => ({ ...c, successRate: Math.round((c.correct / c.total) * 100) }))
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, 5);
  const mostWorkedSubjects = Array.from(bySubjectUsage.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Banque de questions</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{totalQuestions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Par série</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {bySeries.map((s) => (
                <div key={s.seriesId} className="flex justify-between">
                  <span className="text-neutral-600">{seriesNames.get(s.seriesId) ?? "?"}</span>
                  <span className="font-medium text-neutral-900">{s._count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Par matière</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {bySubject.map((s) => (
                <div key={s.subjectId} className="flex justify-between">
                  <span className="text-neutral-600">{subjectNames.get(s.subjectId) ?? "?"}</span>
                  <span className="font-medium text-neutral-900">{s._count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Par difficulté</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {byDifficulty.map((d) => (
                <div key={d.difficulty} className="flex justify-between">
                  <span className="text-neutral-600">{QUESTION_DIFFICULTY_LABELS[d.difficulty]}</span>
                  <span className="font-medium text-neutral-900">{d._count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        {byChapter.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">
                Top 10 chapitres (nombre de questions)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {byChapter.map((c) => (
                <div key={c.chapterId} className="flex justify-between">
                  <span className="text-neutral-600">{chapterNames.get(c.chapterId) ?? "?"}</span>
                  <span className="font-medium text-neutral-900">{c._count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Archives analysées</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Années couvertes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{distinctYears.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Matières sourcées</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{distinctSourcedSubjects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Séries couvertes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{distinctSeriesWithQuestions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Source officielle</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-neutral-900">{officialCount}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Qualité</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {byValidationStatus.map((v) => (
            <Card key={v.validationStatus}>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-neutral-500">
                  {QUESTION_VALIDATION_STATUS_LABELS[v.validationStatus]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-neutral-900">{v._count}</p>
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
                Questions les plus répondues
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {mostAnswered.length === 0 && <p className="text-neutral-500">Pas encore de données.</p>}
              {mostAnswered.map((q, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="truncate text-neutral-600">{q.prompt}</span>
                  <span className="shrink-0 font-medium text-neutral-900">{q.total}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">
                Questions au taux d&apos;erreur élevé
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {highestErrorRate.length === 0 && <p className="text-neutral-500">Pas encore de données.</p>}
              {highestErrorRate.map((q, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="truncate text-neutral-600">{q.prompt}</span>
                  <span className="shrink-0 font-medium text-red-600">{q.errorRate}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">Chapitres difficiles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {hardestChapters.length === 0 && <p className="text-neutral-500">Pas encore de données.</p>}
              {hardestChapters.map((c, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="truncate text-neutral-600">{c.name}</span>
                  <span className="shrink-0 font-medium text-red-600">{c.successRate}% réussite</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-500">
                Matières les plus travaillées
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              {mostWorkedSubjects.length === 0 && <p className="text-neutral-500">Pas encore de données.</p>}
              {mostWorkedSubjects.map((s, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <span className="text-neutral-600">{s.name}</span>
                  <span className="font-medium text-neutral-900">{s.total}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
