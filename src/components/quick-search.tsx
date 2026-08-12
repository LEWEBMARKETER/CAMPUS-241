"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function QuickSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
    router.push(`/annuaire${params}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-lg shadow-brand-blue/5 sm:flex-row"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="size-5 shrink-0 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Une école, une ville, un domaine..."
          className="w-full border-0 bg-transparent py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
        />
      </div>
      <Button type="submit" className="sm:w-auto">
        Rechercher
      </Button>
    </form>
  );
}
