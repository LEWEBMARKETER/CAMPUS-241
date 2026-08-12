"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { createSimulation } from "@/lib/actions/bac-simulations";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

type SeriesOption = { id: string; code: string; name: string };
type SubjectOption = { id: string; name: string; seriesIds: string[] };
type ChapterOption = { id: string; name: string; subjectId: string };

export function SimulationSetupForm({
  allSeries,
  allSubjects,
  allChapters,
  error,
}: {
  allSeries: SeriesOption[];
  allSubjects: SubjectOption[];
  allChapters: ChapterOption[];
  error?: string;
}) {
  const [seriesId, setSeriesId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [mode, setMode] = useState<"ENTRAINEMENT" | "EXAMEN">("ENTRAINEMENT");
  const [chapterIds, setChapterIds] = useState<string[]>([]);

  const subjectsForSeries = useMemo(
    () => allSubjects.filter((s) => !seriesId || s.seriesIds.includes(seriesId)),
    [allSubjects, seriesId],
  );
  const chaptersForSubject = useMemo(
    () => allChapters.filter((c) => c.subjectId === subjectId),
    [allChapters, subjectId],
  );

  function toggleChapter(id: string) {
    setChapterIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  return (
    <form action={createSimulation} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Série</label>
          <select
            name="seriesId"
            required
            value={seriesId}
            onChange={(event) => {
              setSeriesId(event.target.value);
              setSubjectId("");
              setChapterIds([]);
            }}
            className={inputClass}
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {allSeries.map((series) => (
              <option key={series.id} value={series.id}>
                {series.code} — {series.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Matière</label>
          <select
            name="subjectId"
            required
            value={subjectId}
            disabled={!seriesId}
            onChange={(event) => {
              setSubjectId(event.target.value);
              setChapterIds([]);
            }}
            className={inputClass}
          >
            <option value="" disabled>
              {seriesId ? "Sélectionner" : "Choisir une série d'abord"}
            </option>
            {subjectsForSeries.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Mode</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("ENTRAINEMENT")}
            className={`rounded-lg border px-4 py-3 text-left text-sm ${
              mode === "ENTRAINEMENT"
                ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                : "border-black/10 text-neutral-600"
            }`}
          >
            <span className="font-semibold">Entraînement</span>
            <p className="mt-0.5 text-xs text-neutral-500">
              Choisissez vos chapitres, sans limite de temps stricte.
            </p>
          </button>
          <button
            type="button"
            onClick={() => setMode("EXAMEN")}
            className={`rounded-lg border px-4 py-3 text-left text-sm ${
              mode === "EXAMEN"
                ? "border-brand-blue bg-brand-blue-light text-brand-blue"
                : "border-black/10 text-neutral-600"
            }`}
          >
            <span className="font-semibold">Examen</span>
            <p className="mt-0.5 text-xs text-neutral-500">
              Conditions proches du Bac : durée limitée, correction à la fin.
            </p>
          </button>
        </div>
        <input type="hidden" name="mode" value={mode} />
      </div>

      {mode === "ENTRAINEMENT" && subjectId && (
        <div>
          <label className={labelClass}>
            Chapitres (laisser vide pour tous les chapitres)
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {chaptersForSubject.map((chapter) => (
              <label key={chapter.id} className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  type="checkbox"
                  name="chapterIds"
                  value={chapter.id}
                  checked={chapterIds.includes(chapter.id)}
                  onChange={() => toggleChapter(chapter.id)}
                />
                {chapter.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Nombre de questions</label>
          <input
            type="number"
            name="requestedQuestionCount"
            min={1}
            max={50}
            defaultValue={10}
            required
            className={inputClass}
          />
        </div>
        {mode === "EXAMEN" && (
          <div>
            <label className={labelClass}>Durée (minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              min={1}
              max={240}
              defaultValue={30}
              required
              className={inputClass}
            />
          </div>
        )}
      </div>

      <Button type="submit" size="lg" className="w-fit">
        Démarrer la simulation
      </Button>
    </form>
  );
}
