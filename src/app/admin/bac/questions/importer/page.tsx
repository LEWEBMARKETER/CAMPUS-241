import type { Metadata } from "next";

import { QuestionImportForm } from "@/components/admin/question-import-form";

export const metadata: Metadata = { title: "Importer des questions" };

export default function ImportQuestionsPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">
        Importer des questions en masse
      </h2>
      <p className="mt-1 text-sm text-neutral-600">
        Colonnes attendues : Question, Serie, Matiere, Chapitre, Type, Proposition1-4,
        ReponseCorrecte, Difficulte, Explication, Source, Annee. Les séries, matières et
        chapitres doivent déjà exister. Les lignes invalides sont ignorées et détaillées
        dans le rapport après import.
      </p>
      <div className="mt-6 max-w-2xl">
        <QuestionImportForm />
      </div>
    </div>
  );
}
