"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { checkAndAwardBadges } from "@/lib/bac-badges";
import { getQuestionBankSettings } from "@/lib/actions/admin-bac-settings";
import { computeSimulationScore, isAnswerCorrect, type AnswerInput } from "@/lib/scoring";
import { pickWeightedQuestions } from "@/lib/simulation-weighting";

const setupSchema = z.object({
  seriesId: z.string().trim().min(1, "Série requise."),
  subjectId: z.string().trim().min(1, "Matière requise."),
  mode: z.enum(["ENTRAINEMENT", "EXAMEN"]),
  requestedQuestionCount: z.coerce.number().int().min(1).max(50),
  durationMinutes: z.coerce.number().int().min(1).max(240).optional(),
});

export async function createSimulation(formData: FormData) {
  const user = await requireUser();
  const raw = Object.fromEntries(formData.entries());
  const parsed = setupSchema.safeParse(raw);
  if (!parsed.success) {
    redirect(
      `/bac/nouvelle-simulation?error=${encodeURIComponent(
        parsed.error.issues[0]?.message ?? "Formulaire invalide.",
      )}`,
    );
  }

  const { seriesId, subjectId, mode, requestedQuestionCount, durationMinutes } = parsed.data;
  const chapterIds = formData.getAll("chapterIds").map(String);

  const eligibleQuestions = await prisma.question.findMany({
    where: {
      seriesId,
      subjectId,
      published: true,
      ...(chapterIds.length > 0 ? { chapterId: { in: chapterIds } } : {}),
    },
    select: { id: true, frequencyTier: true },
  });

  if (eligibleQuestions.length === 0) {
    redirect(
      `/bac/nouvelle-simulation?error=${encodeURIComponent(
        "Aucune question publiée ne correspond à cette sélection.",
      )}`,
    );
  }

  const settings = await getQuestionBankSettings();
  const selected = pickWeightedQuestions(
    eligibleQuestions,
    {
      TRES_FREQUENTE: settings.weightTresFrequente,
      FREQUENTE: settings.weightFrequente,
      OCCASIONNELLE: settings.weightOccasionnelle,
      RARE: settings.weightRare,
    },
    requestedQuestionCount,
  );

  const simulation = await prisma.simulation.create({
    data: {
      userId: user.id,
      seriesId,
      subjectId,
      mode,
      status: "EN_COURS",
      chapterIds,
      requestedQuestionCount: selected.length,
      durationSeconds: mode === "EXAMEN" && durationMinutes ? durationMinutes * 60 : null,
      answers: {
        create: selected.map((q, index) => ({ questionId: q.id, order: index })),
      },
    },
  });

  redirect(`/bac/simulations/${simulation.id}/passer`);
}

const submitSchema = z.object({
  answersJson: z.string(),
});

export async function submitSimulation(simulationId: string, formData: FormData) {
  const user = await requireUser();

  const simulation = await prisma.simulation.findUnique({
    where: { id: simulationId },
    include: {
      answers: {
        include: { question: { include: { choices: true } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!simulation || simulation.userId !== user.id) {
    redirect("/dashboard/bac");
  }
  if (simulation.status !== "EN_COURS") {
    redirect(`/bac/simulations/${simulationId}/resultats`);
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = submitSchema.safeParse(raw);
  let answersMap: Record<string, AnswerInput> = {};
  if (parsed.success) {
    try {
      answersMap = JSON.parse(parsed.data.answersJson) as Record<string, AnswerInput>;
    } catch {
      answersMap = {};
    }
  }

  let unansweredCount = 0;
  const results: { isCorrect: boolean }[] = [];

  await prisma.$transaction(
    simulation.answers.map((simAnswer) => {
      const answer = answersMap[simAnswer.questionId];
      const wasAnswered = Boolean(
        answer && (answer.selectedChoiceIds?.length || answer.answerText?.trim()),
      );
      if (!wasAnswered) unansweredCount += 1;

      const isCorrect = wasAnswered
        ? isAnswerCorrect(simAnswer.question, simAnswer.question.choices, answer)
        : false;
      results.push({ isCorrect });

      return prisma.simulationAnswer.update({
        where: { id: simAnswer.id },
        data: {
          selectedChoiceIds: answer?.selectedChoiceIds ?? [],
          answerText: answer?.answerText ?? null,
          isCorrect,
        },
      });
    }),
  );

  const { score, correctCount, incorrectCount } = computeSimulationScore(results);
  const finishedAt = new Date();
  const timeSpentSeconds = Math.max(
    0,
    Math.round((finishedAt.getTime() - simulation.startedAt.getTime()) / 1000),
  );

  await prisma.simulation.update({
    where: { id: simulationId },
    data: {
      status: "TERMINEE",
      finishedAt,
      timeSpentSeconds,
      score,
      correctCount,
      incorrectCount,
      unansweredCount,
    },
  });

  await checkAndAwardBadges(user.id);

  revalidatePath("/dashboard/bac");
  redirect(`/bac/simulations/${simulationId}/resultats`);
}
