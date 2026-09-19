import type { Question, QuestionChoice, QuestionType } from "@prisma/client";

export type AnswerInput = {
  selectedChoiceIds?: string[];
  answerText?: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function isAnswerCorrect(
  question: Pick<Question, "type" | "correctAnswerText">,
  choices: QuestionChoice[],
  answer: AnswerInput | undefined,
): boolean {
  if (!answer) return false;

  const choiceBased: QuestionType[] = ["QCM", "QCM_MULTIPLE"];
  if (choiceBased.includes(question.type)) {
    const correctIds = new Set(choices.filter((c) => c.isCorrect).map((c) => c.id));
    const selected = new Set(answer.selectedChoiceIds ?? []);
    if (selected.size !== correctIds.size) return false;
    for (const id of selected) {
      if (!correctIds.has(id)) return false;
    }
    return true;
  }

  if (!answer.answerText || !question.correctAnswerText) return false;
  return normalize(answer.answerText) === normalize(question.correctAnswerText);
}

export function computeSimulationScore(results: { isCorrect: boolean }[]) {
  const total = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const incorrectCount = total - correctCount;
  const score = total > 0 ? (correctCount / total) * 100 : 0;
  return { score, correctCount, incorrectCount, total };
}

export type ChapterBreakdownEntry = {
  chapterId: string;
  chapterName: string;
  correct: number;
  total: number;
  percentage: number;
};

export function computeChapterBreakdown(
  answers: { chapterId: string; chapterName: string; isCorrect: boolean }[],
): ChapterBreakdownEntry[] {
  const byChapter = new Map<string, { chapterName: string; correct: number; total: number }>();

  for (const answer of answers) {
    const entry = byChapter.get(answer.chapterId) ?? {
      chapterName: answer.chapterName,
      correct: 0,
      total: 0,
    };
    entry.total += 1;
    if (answer.isCorrect) entry.correct += 1;
    byChapter.set(answer.chapterId, entry);
  }

  return Array.from(byChapter.entries())
    .map(([chapterId, entry]) => ({
      chapterId,
      chapterName: entry.chapterName,
      correct: entry.correct,
      total: entry.total,
      percentage: entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);
}

export type NotionBreakdownEntry = {
  notion: string;
  correct: number;
  total: number;
  percentage: number;
};

export function computeNotionBreakdown(
  answers: { notion: string | null; isCorrect: boolean }[],
): NotionBreakdownEntry[] {
  const byNotion = new Map<string, { correct: number; total: number }>();

  for (const answer of answers) {
    if (!answer.notion) continue;
    const entry = byNotion.get(answer.notion) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (answer.isCorrect) entry.correct += 1;
    byNotion.set(answer.notion, entry);
  }

  return Array.from(byNotion.entries())
    .map(([notion, entry]) => ({
      notion,
      correct: entry.correct,
      total: entry.total,
      percentage: entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0,
    }))
    .sort((a, b) => a.percentage - b.percentage);
}

export function computeProgression(currentScore: number, previousScores: number[]) {
  if (previousScores.length === 0) return null;
  const average = previousScores.reduce((sum, s) => sum + s, 0) / previousScores.length;
  return Math.round(currentScore - average);
}

export type MasteryThresholds = {
  masteryThreshold1: number;
  masteryThreshold2: number;
  masteryThreshold3: number;
  masteryThreshold4: number;
  masteryThreshold5: number;
};

export const MASTERY_LEVEL_LABELS = [
  "À renforcer",
  "Fragile",
  "En progression",
  "Bon niveau",
  "Très bon niveau",
  "Maîtrise",
] as const;

export function computeMasteryLevel(score: number, thresholds: MasteryThresholds) {
  const bounds = [
    thresholds.masteryThreshold1,
    thresholds.masteryThreshold2,
    thresholds.masteryThreshold3,
    thresholds.masteryThreshold4,
    thresholds.masteryThreshold5,
  ];
  let index = 0;
  for (const bound of bounds) {
    if (score >= bound) index += 1;
    else break;
  }
  return MASTERY_LEVEL_LABELS[index];
}
