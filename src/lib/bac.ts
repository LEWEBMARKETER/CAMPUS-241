import type {
  QuestionDifficulty,
  QuestionFrequencyTier,
  QuestionSourceStatus,
  QuestionType,
  QuestionValidationStatus,
} from "@prisma/client";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  QCM: "QCM (une réponse)",
  QCM_MULTIPLE: "QCM (plusieurs réponses)",
  VRAI_FAUX: "Vrai / Faux",
  REPONSE_COURTE: "Réponse courte",
};

export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  NIVEAU_1_FONDAMENTAL: "Niveau 1 — Fondamental",
  NIVEAU_2_APPLICATION: "Niveau 2 — Application",
  NIVEAU_3_RAISONNEMENT: "Niveau 3 — Raisonnement",
  NIVEAU_4_AVANCE: "Niveau 4 — Avancé",
  NIVEAU_5_EXAMEN: "Niveau 5 — Niveau examen",
};

export const QUESTION_FREQUENCY_LABELS: Record<QuestionFrequencyTier, string> = {
  TRES_FREQUENTE: "Très fréquente",
  FREQUENTE: "Fréquente",
  OCCASIONNELLE: "Occasionnelle",
  RARE: "Rare",
};

export const QUESTION_SOURCE_STATUS_LABELS: Record<QuestionSourceStatus, string> = {
  OFFICIEL: "Officiel",
  VERIFIE: "Vérifié",
  SECONDAIRE: "Secondaire",
};

export const QUESTION_VALIDATION_STATUS_LABELS: Record<QuestionValidationStatus, string> = {
  BROUILLON: "Brouillon",
  EN_ATTENTE_VALIDATION: "En attente de validation",
  VALIDEE: "Validée",
  REJETEE: "Rejetée",
  A_CORRIGER: "À corriger",
};

export const CHOICE_BASED_TYPES: QuestionType[] = ["QCM", "QCM_MULTIPLE"];
