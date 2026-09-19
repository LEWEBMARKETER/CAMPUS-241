"use server";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { prisma } from "@campus241/shared/prisma";
import { requireEditor } from "@/lib/session";
import { AVAILABLE_RESOURCE_FORMATS } from "@campus241/shared/resources";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_ROWS = 1000;

const csvRowSchema = z.object({
  Titre: z.string().trim().min(3, "Titre trop court."),
  Slug: z
    .string()
    .trim()
    .min(3, "Slug trop court.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide (minuscules, chiffres, tirets)."),
  Description: z.string().trim().optional(),
  Auteur: z.string().trim().optional(),
  Type: z.string().trim().min(1, "Type manquant."),
  Format: z.string().trim().optional(),
  FichierURL: z.string().trim().min(1, "URL du fichier manquante."),
  ImageCouvertureURL: z.string().trim().optional(),
  Niveau: z.string().trim().optional(),
  Domaine: z.string().trim().optional(),
  Filiere: z.string().trim().optional(),
  Matiere: z.string().trim().optional(),
  Premium: z.string().trim().optional(),
  PrixLibelle: z.string().trim().optional(),
});

type ResourceTypeValue =
  | "COURS"
  | "FICHE_REVISION"
  | "ANNALE"
  | "EXERCICE"
  | "CORRIGE"
  | "MEMOIRE"
  | "GUIDE"
  | "LIVRE_NUMERIQUE"
  | "SUPPORT_PEDAGOGIQUE";

const TYPE_ALIASES: Record<string, ResourceTypeValue> = {
  cours: "COURS",
  "fiche_revision": "FICHE_REVISION",
  "fiche de revision": "FICHE_REVISION",
  annale: "ANNALE",
  exercice: "EXERCICE",
  corrige: "CORRIGE",
  "corrigé": "CORRIGE",
  memoire: "MEMOIRE",
  "mémoire": "MEMOIRE",
  guide: "GUIDE",
  "livre_numerique": "LIVRE_NUMERIQUE",
  "livre numerique": "LIVRE_NUMERIQUE",
  "support_pedagogique": "SUPPORT_PEDAGOGIQUE",
  "support pedagogique": "SUPPORT_PEDAGOGIQUE",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export type ResourceImportSkippedRow = { row: number; reason: string };
export type ResourceImportState = {
  imported: number;
  skipped: ResourceImportSkippedRow[];
  error?: string;
} | null;

export async function importResourcesFromCsv(
  _prevState: ResourceImportState,
  formData: FormData,
): Promise<ResourceImportState> {
  const user = await requireEditor();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { imported: 0, skipped: [], error: "Merci de sélectionner un fichier CSV." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { imported: 0, skipped: [], error: "Fichier trop volumineux (2 Mo maximum)." };
  }

  const text = await file.text();
  let rows: Record<string, string>[];
  try {
    rows = parse(text, { columns: true, skip_empty_lines: true, trim: true }) as Record<
      string,
      string
    >[];
  } catch {
    return { imported: 0, skipped: [], error: "Impossible de lire ce fichier CSV." };
  }

  if (rows.length === 0) {
    return { imported: 0, skipped: [], error: "Le fichier ne contient aucune ligne." };
  }
  if (rows.length > MAX_ROWS) {
    return {
      imported: 0,
      skipped: [],
      error: `Trop de lignes (${rows.length}), maximum ${MAX_ROWS} par import.`,
    };
  }

  const [allNiveaux, allDomaines, allFilieres, allSubjects, existingSlugs] = await Promise.all([
    prisma.resourceCategory.findMany({ where: { kind: "NIVEAU" } }),
    prisma.resourceCategory.findMany({ where: { kind: "DOMAINE" } }),
    prisma.resourceCategory.findMany({ where: { kind: "FILIERE" } }),
    prisma.resourceSubject.findMany(),
    prisma.resource.findMany({ select: { slug: true } }),
  ]);

  const niveauxByName = new Map(allNiveaux.map((c) => [normalize(c.name), c]));
  const domainesByName = new Map(allDomaines.map((c) => [normalize(c.name), c]));
  const filieresByDomaineAndName = new Map(
    allFilieres.map((c) => [`${c.parentId}::${normalize(c.name)}`, c]),
  );
  const subjectsByName = new Map(allSubjects.map((s) => [normalize(s.name), s]));
  const takenSlugs = new Set(existingSlugs.map((r) => r.slug));

  const skipped: ResourceImportSkippedRow[] = [];
  let imported = 0;

  for (const [index, rawRow] of rows.entries()) {
    const rowNumber = index + 2; // header is row 1
    const parsedRow = csvRowSchema.safeParse(rawRow);
    if (!parsedRow.success) {
      skipped.push({
        row: rowNumber,
        reason: parsedRow.error.issues[0]?.message ?? "Ligne invalide.",
      });
      continue;
    }
    const row = parsedRow.data;

    if (takenSlugs.has(row.Slug)) {
      skipped.push({ row: rowNumber, reason: `Slug déjà utilisé : "${row.Slug}".` });
      continue;
    }

    const type = TYPE_ALIASES[normalize(row.Type)];
    if (!type) {
      skipped.push({ row: rowNumber, reason: `Type de ressource inconnu : "${row.Type}".` });
      continue;
    }

    const format = row.Format ? row.Format.toUpperCase() : "PDF";
    if (!AVAILABLE_RESOURCE_FORMATS.includes(format as never)) {
      skipped.push({ row: rowNumber, reason: `Format non géré : "${row.Format}".` });
      continue;
    }

    const niveau = row.Niveau ? niveauxByName.get(normalize(row.Niveau)) : undefined;
    if (row.Niveau && !niveau) {
      skipped.push({ row: rowNumber, reason: `Niveau inconnu : "${row.Niveau}".` });
      continue;
    }

    const domaine = row.Domaine ? domainesByName.get(normalize(row.Domaine)) : undefined;
    if (row.Domaine && !domaine) {
      skipped.push({ row: rowNumber, reason: `Domaine inconnu : "${row.Domaine}".` });
      continue;
    }

    let filiere;
    if (row.Filiere) {
      if (!domaine) {
        skipped.push({
          row: rowNumber,
          reason: "Une filière doit être accompagnée de son domaine.",
        });
        continue;
      }
      filiere = filieresByDomaineAndName.get(`${domaine.id}::${normalize(row.Filiere)}`);
      if (!filiere) {
        skipped.push({
          row: rowNumber,
          reason: `Filière inconnue pour "${row.Domaine}" : "${row.Filiere}".`,
        });
        continue;
      }
    }

    const subject = row.Matiere ? subjectsByName.get(normalize(row.Matiere)) : undefined;
    if (row.Matiere && !subject) {
      skipped.push({ row: rowNumber, reason: `Matière inconnue : "${row.Matiere}".` });
      continue;
    }

    await prisma.resource.create({
      data: {
        title: row.Titre,
        slug: row.Slug,
        description: row.Description || null,
        author: row.Auteur || null,
        type,
        format: format as "PDF" | "IMAGE" | "DOCUMENT",
        fileUrl: row.FichierURL,
        coverImageUrl: row.ImageCouvertureURL || null,
        niveauId: niveau?.id ?? null,
        domaineId: domaine?.id ?? null,
        filiereId: filiere?.id ?? null,
        subjectId: subject?.id ?? null,
        isPremium: normalize(row.Premium ?? "") === "oui",
        priceLabel: row.PrixLibelle || null,
        status: "EN_ATTENTE",
        createdById: user.id,
      },
    });
    takenSlugs.add(row.Slug);

    imported += 1;
  }

  return { imported, skipped };
}
