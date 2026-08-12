import type { Chapter, Subject } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function ChapterForm({
  chapter,
  subjects,
  action,
  error,
}: {
  chapter?: Chapter;
  subjects: Subject[];
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className={labelClass}>Matière</label>
        <select
          name="subjectId"
          required
          defaultValue={chapter?.subjectId ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Sélectionner
          </option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Nom du chapitre</label>
        <input
          type="text"
          name="name"
          placeholder="Suites"
          required
          defaultValue={chapter?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Ordre d&apos;affichage</label>
        <input
          type="number"
          name="order"
          defaultValue={chapter?.order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={chapter?.isActive ?? true} />
        Actif
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {chapter ? "Enregistrer les modifications" : "Créer le chapitre"}
      </Button>
    </form>
  );
}
