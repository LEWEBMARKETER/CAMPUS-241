import type { BacStatistic, Series } from "@prisma/client";

import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function BacStatisticForm({
  statistic,
  allSeries,
  action,
  error,
}: {
  statistic?: BacStatistic;
  allSeries: Series[];
  action: (formData: FormData) => void;
  error?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Année</label>
          <input
            type="number"
            name="year"
            required
            defaultValue={statistic?.year}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Série</label>
          <select name="seriesId" defaultValue={statistic?.seriesId ?? ""} className={inputClass}>
            <option value="">Toutes séries</option>
            {allSeries.map((series) => (
              <option key={series.id} value={series.id}>
                {series.code}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Province</label>
          <input
            type="text"
            name="province"
            defaultValue={statistic?.province ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Candidats</label>
          <input
            type="number"
            name="candidatesCount"
            defaultValue={statistic?.candidatesCount ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Dont garçons</label>
          <input
            type="number"
            name="maleCandidates"
            defaultValue={statistic?.maleCandidates ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Dont filles</label>
          <input
            type="number"
            name="femaleCandidates"
            defaultValue={statistic?.femaleCandidates ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Admissibles</label>
          <input
            type="number"
            name="admissibleCount"
            defaultValue={statistic?.admissibleCount ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Admis</label>
          <input
            type="number"
            name="admittedCount"
            defaultValue={statistic?.admittedCount ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Ajournés</label>
          <input
            type="number"
            name="postponedCount"
            defaultValue={statistic?.postponedCount ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Taux de réussite (%)</label>
          <input
            type="number"
            step="0.1"
            name="passRate"
            defaultValue={statistic?.passRate ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Statut</label>
          <select
            name="status"
            defaultValue={statistic?.status ?? "NON_DISPONIBLE"}
            className={inputClass}
          >
            <option value="NON_DISPONIBLE">Donnée non disponible</option>
            <option value="OFFICIEL">Donnée officielle</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Source (obligatoire si &laquo; officielle &raquo;)</label>
        <input
          type="text"
          name="source"
          placeholder="Ex : DGEC, communiqué du 15/07/2025"
          defaultValue={statistic?.source ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Notes</label>
        <textarea name="notes" rows={2} defaultValue={statistic?.notes ?? ""} className={inputClass} />
      </div>

      <Button type="submit" className="w-full sm:w-auto">
        {statistic ? "Enregistrer les modifications" : "Ajouter la statistique"}
      </Button>
    </form>
  );
}
