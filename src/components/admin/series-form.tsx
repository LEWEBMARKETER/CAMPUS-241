import type { Series } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function SeriesForm({
  series,
  action,
  error,
}: {
  series?: Series;
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Code</label>
          <input
            type="text"
            name="code"
            placeholder="D"
            required
            defaultValue={series?.code}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Pays</label>
          <input
            type="text"
            name="country"
            defaultValue={series?.country ?? "GA"}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Nom</label>
        <input
          type="text"
          name="name"
          placeholder="Série D — Mathématiques et SVT"
          required
          defaultValue={series?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Ordre d&apos;affichage</label>
        <input
          type="number"
          name="order"
          defaultValue={series?.order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={series?.isActive ?? true} />
        Active
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {series ? "Enregistrer les modifications" : "Créer la série"}
      </Button>
    </form>
  );
}
