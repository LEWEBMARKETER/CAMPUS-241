"use client";

import { useActionState } from "react";
import { Download, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  importQuestionsFromCsv,
  type ImportState,
} from "@/lib/actions/admin-bac-questions-import";

export function QuestionImportForm() {
  const [state, formAction, pending] = useActionState<ImportState, FormData>(
    importQuestionsFromCsv,
    null,
  );

  return (
    <div className="flex flex-col gap-6">
      <a
        href="/modele-import-questions.csv"
        download
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-brand-blue hover:underline"
      >
        <Download className="size-4" />
        Télécharger le gabarit CSV
      </a>

      <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4">
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Fichier CSV
        </label>
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className="text-sm"
        />
        <Button type="submit" disabled={pending} className="w-fit">
          <Upload className="size-4" />
          {pending ? "Import en cours..." : "Importer"}
        </Button>
      </form>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
      )}

      {state && !state.error && (
        <div className="rounded-2xl border border-black/5 bg-white p-4">
          <p className="text-sm font-medium text-brand-green-dark">
            {state.imported} question{state.imported > 1 ? "s" : ""} importée
            {state.imported > 1 ? "s" : ""} (en brouillon, à publier depuis la liste).
          </p>
          {state.skipped.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-red-600">
                {state.skipped.length} ligne{state.skipped.length > 1 ? "s" : ""} ignorée
                {state.skipped.length > 1 ? "s" : ""} :
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-sm text-neutral-600">
                {state.skipped.map((s) => (
                  <li key={s.row}>
                    Ligne {s.row} : {s.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
