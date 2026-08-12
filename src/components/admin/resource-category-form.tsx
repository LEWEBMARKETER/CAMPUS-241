"use client";

import { useState } from "react";
import type { ResourceCategory } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { RESOURCE_CATEGORY_KIND_LABELS } from "@/lib/resources";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function ResourceCategoryForm({
  category,
  domaines,
  action,
  error,
}: {
  category?: ResourceCategory;
  domaines: ResourceCategory[];
  action: (formData: FormData) => void;
  error?: string;
}) {
  const [kind, setKind] = useState(category?.kind ?? "NIVEAU");

  return (
    <form action={action} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div>
        <label className={labelClass}>Type</label>
        <select
          name="kind"
          value={kind}
          onChange={(event) => setKind(event.target.value as typeof kind)}
          className={inputClass}
        >
          {Object.entries(RESOURCE_CATEGORY_KIND_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Nom</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={category?.name}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          name="slug"
          required
          defaultValue={category?.slug}
          className={inputClass}
        />
      </div>

      {kind === "FILIERE" && (
        <div>
          <label className={labelClass}>Domaine parent</label>
          <select
            name="parentId"
            required
            defaultValue={category?.parentId ?? ""}
            className={inputClass}
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {domaines.map((domaine) => (
              <option key={domaine.id} value={domaine.id}>
                {domaine.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className={labelClass}>Ordre d&apos;affichage</label>
        <input
          type="number"
          name="order"
          defaultValue={category?.order ?? 0}
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isActive" defaultChecked={category?.isActive ?? true} />
        Actif
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {category ? "Enregistrer les modifications" : "Créer la catégorie"}
      </Button>
    </form>
  );
}
