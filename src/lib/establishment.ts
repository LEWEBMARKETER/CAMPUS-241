import type {
  EstablishmentPlan,
  EstablishmentStatus,
  EstablishmentType,
  PublicOrPrivate,
} from "@prisma/client";

export const ESTABLISHMENT_TYPE_LABELS: Record<EstablishmentType, string> = {
  COLLEGE_LYCEE: "Collège / Lycée",
  UNIVERSITE: "Université",
  GRANDE_ECOLE: "Grande école",
  CENTRE_FORMATION: "Centre de formation",
};

export const ESTABLISHMENT_STATUS_LABELS: Record<EstablishmentStatus, string> = {
  PENDING_REVIEW: "En attente de validation",
  ACTIVE: "Active",
  SUSPENDED: "Suspendue",
  REJECTED: "Rejetée",
};

export const ESTABLISHMENT_PLAN_LABELS: Record<EstablishmentPlan, string> = {
  FREE: "Gratuit",
  PRO: "Pro",
  PREMIUM: "Premium",
};

export const PUBLIC_PRIVATE_LABELS: Record<PublicOrPrivate, string> = {
  PUBLIC: "Public",
  PRIVE: "Privé",
};

export const FILIERES = [
  "Sciences",
  "Commerce & Gestion",
  "Droit",
  "Santé",
  "Informatique",
  "Ingénierie",
  "Lettres & Sciences humaines",
  "Communication",
] as const;

export const BUDGET_RANGES = [
  "Moins de 500 000 FCFA/an",
  "500 000 - 1 000 000 FCFA/an",
  "1 000 000 - 2 000 000 FCFA/an",
  "Plus de 2 000 000 FCFA/an",
] as const;
