import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  rejectQuestion,
  requestCorrection,
  validateQuestion,
} from "@/lib/actions/admin-bac-validation";
import {
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_SOURCE_STATUS_LABELS,
  QUESTION_TYPE_LABELS,
} from "@/lib/bac";
import { prisma } from "@/lib/prisma";
import { requireValidator } from "@/lib/session";

export const metadata: Metadata = { title: "Validation pédagogique" };

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";

export default async function ValidationQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireValidator();
  const { error } = await searchParams;

  const questions = await prisma.question.findMany({
    where: { validationStatus: "EN_ATTENTE_VALIDATION" },
    include: { series: true, subject: true, chapter: true, choices: true, createdBy: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <p className="text-sm text-neutral-500">
        {questions.length} question{questions.length > 1 ? "s" : ""} en attente de validation
      </p>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      {questions.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-12 text-center text-neutral-500">
          Aucune question en attente. La file de validation est à jour.
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base">{question.prompt}</CardTitle>
                <p className="mt-1 text-xs text-neutral-500">
                  {question.series.code} · {question.subject.name} · {question.chapter.name}
                  {question.subChapter ? ` · ${question.subChapter}` : ""}
                  {" · "}
                  {QUESTION_TYPE_LABELS[question.type]}
                  {" · "}
                  {QUESTION_DIFFICULTY_LABELS[question.difficulty]}
                  {" · Source : "}
                  {QUESTION_SOURCE_STATUS_LABELS[question.sourceStatus]}
                  {question.createdBy ? ` · Créée par ${question.createdBy.prenom} ${question.createdBy.nom}` : ""}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {question.choices.length > 0 && (
                  <ul className="flex flex-col gap-1 text-sm">
                    {question.choices.map((choice) => (
                      <li
                        key={choice.id}
                        className={choice.isCorrect ? "font-medium text-brand-green-dark" : "text-neutral-600"}
                      >
                        {choice.isCorrect ? "✓ " : "— "}
                        {choice.label}
                      </li>
                    ))}
                  </ul>
                )}
                {question.correctAnswerText && (
                  <p className="text-sm text-neutral-700">
                    Réponse attendue : <span className="font-medium">{question.correctAnswerText}</span>
                  </p>
                )}
                {question.explanation && (
                  <p className="text-sm text-neutral-600">Explication : {question.explanation}</p>
                )}
                {question.method && (
                  <p className="text-sm text-neutral-600">Méthode : {question.method}</p>
                )}
                {question.commonMistake && (
                  <p className="text-sm text-neutral-600">Piège fréquent : {question.commonMistake}</p>
                )}

                <div className="mt-2 flex flex-wrap gap-2 border-t border-black/5 pt-3">
                  <form action={validateQuestion.bind(null, question.id)}>
                    <Button type="submit" size="sm">
                      Valider
                    </Button>
                  </form>
                  <details className="w-full">
                    <summary className="cursor-pointer text-sm font-medium text-neutral-600 hover:text-brand-blue">
                      Renvoyer à corriger / Rejeter
                    </summary>
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <form
                        action={requestCorrection.bind(null, question.id)}
                        className="flex flex-1 gap-2"
                      >
                        <input
                          type="text"
                          name="note"
                          placeholder="Motif de la correction demandée"
                          className={inputClass}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          À corriger
                        </Button>
                      </form>
                      <form
                        action={rejectQuestion.bind(null, question.id)}
                        className="flex flex-1 gap-2"
                      >
                        <input
                          type="text"
                          name="note"
                          placeholder="Motif du rejet"
                          className={inputClass}
                        />
                        <Button type="submit" variant="outline" size="sm">
                          Rejeter
                        </Button>
                      </form>
                    </div>
                  </details>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
