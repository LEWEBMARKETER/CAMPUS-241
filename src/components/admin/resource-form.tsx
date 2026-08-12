"use client";

import { useMemo, useState } from "react";
import type { Resource, ResourceCategory, ResourceSubject } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  AVAILABLE_RESOURCE_FORMATS,
  RESOURCE_FORMAT_LABELS,
  RESOURCE_STATUS_LABELS,
  RESOURCE_TYPE_LABELS,
} from "@/lib/resources";

const inputClass =
  "w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export function ResourceForm({
  resource,
  niveaux,
  domaines,
  filieres,
  subjects,
  action,
  error,
}: {
  resource?: Resource;
  niveaux: ResourceCategory[];
  domaines: ResourceCategory[];
  filieres: ResourceCategory[];
  subjects: ResourceSubject[];
  action: (formData: FormData) => void;
  error?: string;
}) {
  const [domaineId, setDomaineId] = useState(resource?.domaineId ?? "");

  const filieresForDomaine = useMemo(
    () => filieres.filter((filiere) => filiere.parentId === domaineId),
    [filieres, domaineId],
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div>
        <label className={labelClass}>Titre</label>
        <input
          type="text"
          name="title"
          required
          defaultValue={resource?.title}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Slug</label>
        <input
          type="text"
          name="slug"
          required
          defaultValue={resource?.slug}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={resource?.description ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Auteur</label>
        <input
          type="text"
          name="author"
          defaultValue={resource?.author ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" defaultValue={resource?.type ?? "COURS"} className={inputClass}>
            {Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Format</label>
          <select name="format" defaultValue={resource?.format ?? "PDF"} className={inputClass}>
            {AVAILABLE_RESOURCE_FORMATS.map((value) => (
              <option key={value} value={value}>
                {RESOURCE_FORMAT_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>URL du fichier</label>
        <input
          type="text"
          name="fileUrl"
          placeholder="https://…"
          defaultValue={resource?.fileUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>URL de l&apos;image de couverture</label>
        <input
          type="text"
          name="coverImageUrl"
          placeholder="https://…"
          defaultValue={resource?.coverImageUrl ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Niveau</label>
          <select name="niveauId" defaultValue={resource?.niveauId ?? ""} className={inputClass}>
            <option value="">Aucun</option>
            {niveaux.map((niveau) => (
              <option key={niveau.id} value={niveau.id}>
                {niveau.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Matière</label>
          <select name="subjectId" defaultValue={resource?.subjectId ?? ""} className={inputClass}>
            <option value="">Aucune</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Domaine</label>
          <select
            name="domaineId"
            value={domaineId}
            onChange={(event) => setDomaineId(event.target.value)}
            className={inputClass}
          >
            <option value="">Aucun</option>
            {domaines.map((domaine) => (
              <option key={domaine.id} value={domaine.id}>
                {domaine.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Filière</label>
          <select
            name="filiereId"
            defaultValue={resource?.filiereId ?? ""}
            disabled={!domaineId}
            className={inputClass}
          >
            <option value="">{domaineId ? "Aucune" : "Choisir un domaine d'abord"}</option>
            {filieresForDomaine.map((filiere) => (
              <option key={filiere.id} value={filiere.id}>
                {filiere.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Statut</label>
          <select name="status" defaultValue={resource?.status ?? "BROUILLON"} className={inputClass}>
            {Object.entries(RESOURCE_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Libellé de prix (si premium)</label>
          <input
            type="text"
            name="priceLabel"
            placeholder="Ex : 2 000 FCFA"
            defaultValue={resource?.priceLabel ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="isPremium" defaultChecked={resource?.isPremium ?? false} />
        Ressource premium
      </label>

      <Button type="submit" className="w-full sm:w-auto">
        {resource ? "Enregistrer les modifications" : "Créer la ressource"}
      </Button>
    </form>
  );
}
