"use server";

import { parse } from "csv-parse/sync";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireEditor } from "@/lib/session";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const MAX_ROWS = 2000;

const csvRowSchema = z.object({
  Question: z.string().trim().min(5, "Énoncé trop court."),
  Serie: z.string().trim().min(1, "Série manquante."),
  Matiere: z.string().trim().min(1, "Matière manquante."),
  Chapitre: z.string().trim().min(1, "Chapitre manquant."),
  Type: z.string().trim().optional(),
  Proposition1: z.string().trim().optional(),
  Proposition2: z.string().trim().optional(),
  Proposition3: z.string().trim().optional(),
  Proposition4: z.string().trim().optional(),
  ReponseCorrecte: z.string().trim().min(1, "Réponse correcte manquante."),
  Difficulte: z.string().trim().optional(),
  Explication: z.string().trim().optional(),
  Source: z.string().trim().optional(),
  Annee: z.string().trim().optional(),
});

const TYPE_ALIASES: Record<string, "QCM" | "QCM_MULTIPLE" | "VRAI_FAUX" | "REPONSE_COURTE"> = {
  qcm: "QCM",
  "qcm_multiple": "QCM_MULTIPLE",
  "qcm multiple": "QCM_MULTIPLE",
  "vrai_faux": "VRAI_FAUX",
  "vrai/faux": "VRAI_FAUX",
  "reponse_courte": "REPONSE_COURTE",
  "reponse courte": "REPONSE_COURTE",
};

type DifficultyValue =
  | "NIVEAU_1_FONDAMENTAL"
  | "NIVEAU_2_APPLICATION"
  | "NIVEAU_3_RAISONNEMENT"
  | "NIVEAU_4_AVANCE"
  | "NIVEAU_5_EXAMEN";

const DIFFICULTY_ALIASES: Record<string, DifficultyValue> = {
  facile: "NIVEAU_1_FONDAMENTAL",
  fondamental: "NIVEAU_1_FONDAMENTAL",
  "1": "NIVEAU_1_FONDAMENTAL",
  moyen: "NIVEAU_2_APPLICATION",
  application: "NIVEAU_2_APPLICATION",
  "2": "NIVEAU_2_APPLICATION",
  raisonnement: "NIVEAU_3_RAISONNEMENT",
  "3": "NIVEAU_3_RAISONNEMENT",
  difficile: "NIVEAU_4_AVANCE",
  avance: "NIVEAU_4_AVANCE",
  "avancé": "NIVEAU_4_AVANCE",
  "4": "NIVEAU_4_AVANCE",
  examen: "NIVEAU_5_EXAMEN",
  "5": "NIVEAU_5_EXAMEN",
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export type ImportSkippedRow = { row: number; reason: string };
export type ImportState = {
  imported: number;
  skipped: ImportSkippedRow[];
  error?: string;
} | null;

export async function importQuestionsFromCsv(
  _prevState: ImportState,
  formData: FormData,
): Promise<ImportState> {
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

  const [allSeries, allSubjects, allChapters] = await Promise.all([
    prisma.series.findMany(),
    prisma.subject.findMany(),
    prisma.chapter.findMany(),
  ]);

  const seriesByCode = new Map(allSeries.map((s) => [normalize(s.code), s]));
  const subjectsByName = new Map(allSubjects.map((s) => [normalize(s.name), s]));
  const chaptersBySubjectAndName = new Map(
    allChapters.map((c) => [`${c.subjectId}::${normalize(c.name)}`, c]),
  );

  const skipped: ImportSkippedRow[] = [];
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

    const series = seriesByCode.get(normalize(row.Serie));
    if (!series) {
      skipped.push({ row: rowNumber, reason: `Série inconnue : "${row.Serie}".` });
      continue;
    }

    const subject = subjectsByName.get(normalize(row.Matiere));
    if (!subject) {
      skipped.push({ row: rowNumber, reason: `Matière inconnue : "${row.Matiere}".` });
      continue;
    }

    const chapter = chaptersBySubjectAndName.get(`${subject.id}::${normalize(row.Chapitre)}`);
    if (!chapter) {
      skipped.push({
        row: rowNumber,
        reason: `Chapitre inconnu pour "${row.Matiere}" : "${row.Chapitre}".`,
      });
      continue;
    }

    const type = row.Type ? TYPE_ALIASES[normalize(row.Type)] : "QCM";
    if (!type) {
      skipped.push({ row: rowNumber, reason: `Type de question inconnu : "${row.Type}".` });
      continue;
    }

    const difficulty = row.Difficulte
      ? DIFFICULTY_ALIASES[normalize(row.Difficulte)]
      : "NIVEAU_2_APPLICATION";
    if (!difficulty) {
      skipped.push({ row: rowNumber, reason: `Difficulté inconnue : "${row.Difficulte}".` });
      continue;
    }

    const examYear = row.Annee ? Number(row.Annee) : null;
    if (row.Annee && Number.isNaN(examYear)) {
      skipped.push({ row: rowNumber, reason: `Année invalide : "${row.Annee}".` });
      continue;
    }

    if (type === "QCM" || type === "QCM_MULTIPLE") {
      const propositions = [row.Proposition1, row.Proposition2, row.Proposition3, row.Proposition4]
        .filter((p): p is string => Boolean(p && p.trim()))
        .map((p) => p.trim());
      if (propositions.length < 2) {
        skipped.push({ row: rowNumber, reason: "Au moins 2 propositions requises pour un QCM." });
        continue;
      }
      const correctAnswers = row.ReponseCorrecte.split(/[;|]/).map((a) => normalize(a));
      const choices = propositions.map((label) => ({
        label,
        isCorrect: correctAnswers.includes(normalize(label)),
      }));
      if (!choices.some((c) => c.isCorrect)) {
        skipped.push({
          row: rowNumber,
          reason: "La réponse correcte ne correspond à aucune proposition.",
        });
        continue;
      }

      await prisma.question.create({
        data: {
          seriesId: series.id,
          subjectId: subject.id,
          chapterId: chapter.id,
          type,
          difficulty,
          prompt: row.Question,
          explanation: row.Explication || null,
          source: row.Source || null,
          examYear,
          published: false,
          createdById: user.id,
          choices: { create: choices.map((c, order) => ({ ...c, order })) },
        },
      });
    } else {
      await prisma.question.create({
        data: {
          seriesId: series.id,
          subjectId: subject.id,
          chapterId: chapter.id,
          type,
          difficulty,
          prompt: row.Question,
          explanation: row.Explication || null,
          source: row.Source || null,
          examYear,
          correctAnswerText: row.ReponseCorrecte,
          published: false,
          createdById: user.id,
        },
      });
    }

    imported += 1;
  }

  return { imported, skipped };
}
