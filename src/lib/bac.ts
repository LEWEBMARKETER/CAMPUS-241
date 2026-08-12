import type { QuestionDifficulty, QuestionType } from "@prisma/client";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  QCM: "QCM (une réponse)",
  QCM_MULTIPLE: "QCM (plusieurs réponses)",
  VRAI_FAUX: "Vrai / Faux",
  REPONSE_COURTE: "Réponse courte",
};

export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  FACILE: "Facile",
  MOYEN: "Moyen",
  DIFFICILE: "Difficile",
};

export const CHOICE_BASED_TYPES: QuestionType[] = ["QCM", "QCM_MULTIPLE"];
