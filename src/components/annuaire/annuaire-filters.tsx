"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  BUDGET_RANGES,
  ESTABLISHMENT_TYPE_LABELS,
  FILIERES,
  PUBLIC_PRIVATE_LABELS,
} from "@/lib/establishment";

export function AnnuaireFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
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
          placeholder="Nom d'établissement..."
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
          {Object.entries(ESTABLISHMENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("city") ?? ""}
          onChange={(event) => updateParam("city", event.target.value)}
        >
          <option value="">Toutes les villes</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("secteur") ?? ""}
          onChange={(event) => updateParam("secteur", event.target.value)}
        >
          <option value="">Public / Privé</option>
          {Object.entries(PUBLIC_PRIVATE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("filiere") ?? ""}
          onChange={(event) => updateParam("filiere", event.target.value)}
        >
          <option value="">Toutes les filières</option>
          {FILIERES.map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-black/10 px-3 py-2 text-sm text-neutral-700"
          value={searchParams.get("budget") ?? ""}
          onChange={(event) => updateParam("budget", event.target.value)}
        >
          <option value="">Tous les budgets</option>
          {BUDGET_RANGES.map((budget) => (
            <option key={budget} value={budget}>
              {budget}
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
