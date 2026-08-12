import type { Series, Subject } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function SubjectForm({
  subject,
  selectedSeriesIds = [],
  allSeries,
  action,
  error,
}: {
  subject?: Subject;
  selectedSeriesIds?: string[];
  allSeries: Series[];
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className={labelClass}>Nom</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={subject?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          name="slug"
          placeholder="mathematiques"
          required
          defaultValue={subject?.slug}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Ordre d&apos;affichage</label>
        <input
          type="number"
          name="order"
          defaultValue={subject?.order ?? 0}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Séries concernées</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allSeries.map((series) => (
            <label key={series.id} className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                name="seriesIds"
                value={series.id}
                defaultChecked={selectedSeriesIds.includes(series.id)}
              />
              {series.code}
            </label>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={subject?.isActive ?? true} />
        Active
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {subject ? "Enregistrer les modifications" : "Créer la matière"}
      </Button>
    </form>
  );
}
