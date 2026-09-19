import type { EstablishmentLevel, PublicOrPrivate } from "@prisma/client";

export const ESTABLISHMENT_LEVEL_LABELS: Record<EstablishmentLevel, string> = {
  PRIMAIRE: "Primaire",
  COLLEGE: "Collège",
  LYCEE: "Lycée",
  SUPERIEUR: "Supérieur",
};

export const PUBLIC_PRIVATE_LABELS: Record<PublicOrPrivate, string> = {
  PUBLIC: "Public",
  PRIVE: "Privé",
};

export const GABON_PROVINCES = [
  "Estuaire",
  "Haut-Ogooué",
  "Moyen-Ogooué",
  "Ngounié",
  "Nyanga",
  "Ogooué-Ivindo",
  "Ogooué-Lolo",
  "Ogooué-Maritime",
  "Woleu-Ntem",
] as const;

// Classes suggérées par niveau, pour les cases à cocher du formulaire admin
// et pour garder "classes proposées" structurées (utile pour la recherche).
export const CLASSES_BY_LEVEL: Record<"PRIMAIRE" | "COLLEGE" | "LYCEE", string[]> = {
  PRIMAIRE: ["CP", "CE1", "CE2", "CM1", "CM2"],
  COLLEGE: ["6e", "5e", "4e", "3e"],
  LYCEE: ["2nde", "1re", "Tle"],
};
