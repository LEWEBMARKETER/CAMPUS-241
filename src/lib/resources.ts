import type {
  ResourceCategoryKind,
  ResourceFormat,
  ResourceStatus,
  ResourceType,
} from "@prisma/client";

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  COURS: "Cours",
  FICHE_REVISION: "Fiche de révision",
  ANNALE: "Annale",
  EXERCICE: "Exercice",
  CORRIGE: "Corrigé",
  MEMOIRE: "Mémoire",
  GUIDE: "Guide",
  LIVRE_NUMERIQUE: "Livre numérique",
  SUPPORT_PEDAGOGIQUE: "Support pédagogique",
};

export const RESOURCE_FORMAT_LABELS: Record<ResourceFormat, string> = {
  PDF: "PDF",
  IMAGE: "Image",
  DOCUMENT: "Document texte",
  VIDEO: "Vidéo",
  AUDIO: "Audio",
  INTERACTIF: "Contenu interactif",
};

export const RESOURCE_STATUS_LABELS: Record<ResourceStatus, string> = {
  BROUILLON: "Brouillon",
  EN_ATTENTE: "En attente",
  VALIDE: "Validé",
  PUBLIE: "Publié",
  ARCHIVE: "Archivé",
};

export const RESOURCE_CATEGORY_KIND_LABELS: Record<ResourceCategoryKind, string> = {
  NIVEAU: "Niveau",
  DOMAINE: "Domaine",
  FILIERE: "Filière",
};

// V1 : seuls PDF, image et document texte sont réellement gérables (upload par URL).
// Vidéo/audio/interactif sont prévus dans le schéma mais pas utilisables en pratique.
export const AVAILABLE_RESOURCE_FORMATS: ResourceFormat[] = ["PDF", "IMAGE", "DOCUMENT"];
