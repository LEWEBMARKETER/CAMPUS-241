"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ConseillerFilters({ cities }: { cities: string[] }) {
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

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:flex-row">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateParam("q", q.trim());
        }}
        className="flex flex-1 gap-2"
      >
        <input
          type="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Nom ou spécialité..."
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand-blue"
        />
        <Button type="submit" size="sm">
          Rechercher
        </Button>
      </form>

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
    </div>
  );
}
