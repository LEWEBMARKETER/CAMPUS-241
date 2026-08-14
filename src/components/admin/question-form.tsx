"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { Chapter, Question, QuestionChoice, Series, Subject } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  CHOICE_BASED_TYPES,
  QUESTION_DIFFICULTY_LABELS,
  QUESTION_FREQUENCY_LABELS,
  QUESTION_SOURCE_STATUS_LABELS,
  QUESTION_TYPE_LABELS,
} from "@/lib/bac";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

type ChoiceDraft = { label: string; isCorrect: boolean };

export function QuestionForm({
  question,
  choices: initialChoices,
  allSeries,
  allSubjects,
  allChapters,
  action,
  error,
}: {
  question?: Question;
  choices?: QuestionChoice[];
  allSeries: Series[];
  allSubjects: Subject[];
  allChapters: Chapter[];
  action: (formData: FormData) => void;
  error?: string;
}) {
  const [type, setType] = useState(question?.type ?? "QCM");
  const [subjectId, setSubjectId] = useState(question?.subjectId ?? "");
  const [choices, setChoices] = useState<ChoiceDraft[]>(
    initialChoices?.length
      ? initialChoices.map((c) => ({ label: c.label, isCorrect: c.isCorrect }))
      : [
          { label: "", isCorrect: false },
          { label: "", isCorrect: false },
        ],
  );

  const isChoiceBased = CHOICE_BASED_TYPES.includes(type);
  const chaptersForSubject = useMemo(
    () => allChapters.filter((chapter) => chapter.subjectId === subjectId),
    [allChapters, subjectId],
  );

  function updateChoice(index: number, patch: Partial<ChoiceDraft>) {
    setChoices((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addChoice() {
    setChoices((prev) => [...prev, { label: "", isCorrect: false }]);
  }

  function removeChoice(index: number) {
    setChoices((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className={labelClass}>Énoncé</label>
        <textarea
          name="prompt"
          rows={3}
          required
          defaultValue={question?.prompt}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Série</label>
          <select
            name="seriesId"
            required
            defaultValue={question?.seriesId ?? ""}
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
            onChange={(event) => setSubjectId(event.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {allSubjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Chapitre</label>
          <select
            name="chapterId"
            required
            defaultValue={question?.chapterId ?? ""}
            disabled={!subjectId}
            className={inputClass}
          >
            <option value="" disabled>
              {subjectId ? "Sélectionner" : "Choisir une matière d'abord"}
            </option>
            {chaptersForSubject.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Sous-chapitre</label>
          <input
            type="text"
            name="subChapter"
            defaultValue={question?.subChapter ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Notion</label>
          <input
            type="text"
            name="notion"
            placeholder="Ex : Probabilités conditionnelles"
            defaultValue={question?.notion ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Compétence évaluée</label>
          <input
            type="text"
            name="competency"
            defaultValue={question?.competency ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Type</label>
          <select
            name="type"
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
            className={inputClass}
          >
            {Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Difficulté</label>
          <select
            name="difficulty"
            defaultValue={question?.difficulty ?? "NIVEAU_2_APPLICATION"}
            className={inputClass}
          >
            {Object.entries(QUESTION_DIFFICULTY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Fréquence (récurrence dans les annales)</label>
          <select
            name="frequencyTier"
            defaultValue={question?.frequencyTier ?? ""}
            className={inputClass}
          >
            <option value="">Non évaluée</option>
            {Object.entries(QUESTION_FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isChoiceBased ? (
        <div>
          <label className={labelClass}>
            Propositions{" "}
            {type === "QCM"
              ? "(cochez la bonne réponse)"
              : "(cochez toutes les bonnes réponses)"}
          </label>
          <div className="flex flex-col gap-2">
            {choices.map((choice, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={choice.isCorrect}
                  onChange={(event) => updateChoice(index, { isCorrect: event.target.checked })}
                />
                <input
                  type="text"
                  placeholder={`Proposition ${index + 1}`}
                  value={choice.label}
                  onChange={(event) => updateChoice(index, { label: event.target.value })}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => removeChoice(index)}
                  disabled={choices.length <= 2}
                  className="rounded-lg p-2 text-neutral-400 hover:text-red-600 disabled:opacity-30"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addChoice}
            className="mt-2 flex items-center gap-1 text-sm font-medium text-brand-blue hover:underline"
          >
            <Plus className="size-4" />
            Ajouter une proposition
          </button>
          <input type="hidden" name="choicesJson" value={JSON.stringify(choices)} />
        </div>
      ) : type === "VRAI_FAUX" ? (
        <div>
          <label className={labelClass}>Réponse correcte</label>
          <select
            name="correctAnswerText"
            defaultValue={question?.correctAnswerText ?? "vrai"}
            className={inputClass}
          >
            <option value="vrai">Vrai</option>
            <option value="faux">Faux</option>
          </select>
        </div>
      ) : (
        <div>
          <label className={labelClass}>Réponse correcte</label>
          <input
            type="text"
            name="correctAnswerText"
            required
            defaultValue={question?.correctAnswerText ?? ""}
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Explication (pourquoi cette réponse est correcte)</label>
        <textarea
          name="explanation"
          rows={2}
          defaultValue={question?.explanation ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Méthode</label>
          <textarea
            name="method"
            rows={2}
            placeholder="La méthode à appliquer pour résoudre"
            defaultValue={question?.method ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Piège / erreur fréquente</label>
          <textarea
            name="commonMistake"
            rows={2}
            defaultValue={question?.commonMistake ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Année (annale)</label>
          <input
            type="number"
            name="examYear"
            defaultValue={question?.examYear ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Source</label>
          <input
            type="text"
            name="source"
            placeholder="Ex : Sujet Bac D 2019"
            defaultValue={question?.source ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Statut de la source</label>
          <select
            name="sourceStatus"
            defaultValue={question?.sourceStatus ?? "SECONDAIRE"}
            className={inputClass}
          >
            {Object.entries(QUESTION_SOURCE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sm:w-1/3">
        <label className={labelClass}>Temps estimé (secondes)</label>
        <input
          type="number"
          name="estimatedTimeSeconds"
          defaultValue={question?.estimatedTimeSeconds ?? ""}
          className={inputClass}
        />
      </div>

      <p className="text-xs text-neutral-500">
        Une question créée ou modifiée ici repart en brouillon et doit être soumise à la
        validation pédagogique avant de pouvoir être publiée.
      </p>

      <Button type="submit" className="w-full sm:w-auto">
        {question ? "Enregistrer les modifications" : "Créer la question"}
      </Button>
    </form>
  );
}
