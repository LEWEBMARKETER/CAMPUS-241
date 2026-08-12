"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import type { ResourceCategory, ResourceSubject } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { RESOURCE_TYPE_LABELS } from "@/lib/resources";

export function ResourceFilters({
  niveaux,
  domaines,
  filieres,
  subjects,
}: {
  niveaux: ResourceCategory[];
  domaines: ResourceCategory[];
  filieres: ResourceCategory[];
  subjects: ResourceSubject[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  const domaineId = searchParams.get("domaineId") ?? "";
  const filieresForDomaine = useMemo(
    () => filieres.filter((filiere) => filiere.parentId === domaineId),
    [filieres, domaineId],
  );

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key === "domaineId") {
      params.delete("filiereId");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateParam("q", q.trim());
  }

  const hasActiveFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Titre de la ressource…"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <Button type="submit" size="sm">
          Rechercher
        </Button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("type") ?? ""}
          onChange={(event) => updateParam("type", event.target.value)}
        >
          <option value="">Tous les types</option>
          {Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("niveauId") ?? ""}
          onChange={(event) => updateParam("niveauId", event.target.value)}
        >
          <option value="">Tous les niveaux</option>
          {niveaux.map((niveau) => (
            <option key={niveau.id} value={niveau.id}>
              {niveau.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={domaineId}
          onChange={(event) => updateParam("domaineId", event.target.value)}
        >
          <option value="">Tous les domaines</option>
          {domaines.map((domaine) => (
            <option key={domaine.id} value={domaine.id}>
              {domaine.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("filiereId") ?? ""}
          onChange={(event) => updateParam("filiereId", event.target.value)}
          disabled={!domaineId}
        >
          <option value="">{domaineId ? "Toutes les filières" : "Choisir un domaine"}</option>
          {filieresForDomaine.map((filiere) => (
            <option key={filiere.id} value={filiere.id}>
              {filiere.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("subjectId") ?? ""}
          onChange={(event) => updateParam("subjectId", event.target.value)}
        >
          <option value="">Toutes les matières</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => {
            setQ("");
            router.push(pathname);
          }}
          className="mt-3 text-sm font-medium text-brand-blue hover:underline"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
