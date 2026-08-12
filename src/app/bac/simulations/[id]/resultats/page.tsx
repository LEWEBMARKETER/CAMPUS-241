import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, TrendingUp, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { computeChapterBreakdown, computeProgression } from "@/lib/scoring";

export const metadata: Metadata = { title: "Résultats de la simulation" };

function formatDuration(seconds: number | null) {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes} min ${rest.toString().padStart(2, "0")} s`;
}

export default async function SimulationResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: {
      series: true,
      subject: true,
      answers: {
        include: { question: { include: { chapter: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!simulation || simulation.userId !== user.id) {
    redirect("/dashboard/bac");
  }
  if (simulation.status !== "TERMINEE") {
    redirect(`/bac/simulations/${id}/passer`);
  }

  const previousSimulations = await prisma.simulation.findMany({
    where: {
      userId: user.id,
      subjectId: simulation.subjectId,
      status: "TERMINEE",
      id: { not: simulation.id },
    },
    select: { score: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const progression = computeProgression(
    simulation.score ?? 0,
    previousSimulations.map((s) => s.score ?? 0),
  );

  const breakdown = computeChapterBreakdown(
    simulation.answers.map((a) => ({
      chapterId: a.question.chapterId,
      chapterName: a.question.chapter.name,
      isCorrect: a.isCorrect ?? false,
    })),
  );
  const strongChapters = breakdown.filter((b) => b.percentage >= 60);
  const weakChapters = breakdown.filter((b) => b.percentage < 60);

  const total = simulation.answers.length;
  const scoreOn20 = simulation.score !== null ? Math.round((simulation.score / 100) * 20 * 10) / 10 : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm text-neutral-500">
        {simulation.series.code} · {simulation.subject.name} ·{" "}
        {simulation.mode === "EXAMEN" ? "Mode examen" : "Mode entraînement"}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-neutral-900">
        {scoreOn20}/20 — {Math.round(simulation.score ?? 0)}%
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-5 text-center">
            <CheckCircle2 className="mx-auto size-5 text-brand-green" />
            <p className="mt-2 text-2xl font-bold text-neutral-900">{simulation.correctCount}</p>
            <p className="text-xs text-neutral-500">Bonnes réponses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <XCircle className="mx-auto size-5 text-red-500" />
            <p className="mt-2 text-2xl font-bold text-neutral-900">{simulation.incorrectCount}</p>
            <p className="text-xs text-neutral-500">Mauvaises réponses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <Clock className="mx-auto size-5 text-brand-blue" />
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {formatDuration(simulation.timeSpentSeconds)}
            </p>
            <p className="text-xs text-neutral-500">Temps utilisé</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 text-center">
            <TrendingUp className="mx-auto size-5 text-brand-blue" />
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {progression === null ? "—" : `${progression > 0 ? "+" : ""}${progression}%`}
            </p>
            <p className="text-xs text-neutral-500">Progression</p>
          </CardContent>
        </Card>
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {simulation.correctCount}/{total} bonnes réponses
        {simulation.unansweredCount ? ` · ${simulation.unansweredCount} sans réponse` : ""}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-brand-green-dark">Points forts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {strongChapters.length === 0 && (
              <p className="text-sm text-neutral-500">Aucun chapitre à plus de 60% cette fois.</p>
            )}
            {strongChapters.map((c) => (
              <div key={c.chapterId} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">{c.chapterName}</span>
                <span className="font-medium text-brand-green-dark">{c.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-600">À améliorer</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {weakChapters.length === 0 && (
              <p className="text-sm text-neutral-500">Rien en dessous de 60% cette fois, bravo !</p>
            )}
            {weakChapters.map((c) => (
              <div key={c.chapterId} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">{c.chapterName}</span>
                <span className="font-medium text-red-600">{c.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/bac/nouvelle-simulation">Nouvelle simulation</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/bac">Voir mon historique</Link>
        </Button>
      </div>
    </div>
  );
}
