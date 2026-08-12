import type { Metadata } from "next";

import { SeriesForm } from "@/components/admin/series-form";
import { createSeries } from "@/lib/actions/admin-bac-series";

export const metadata: Metadata = { title: "Nouvelle série" };

export default async function NewSeriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Nouvelle série</h2>
      <div className="mt-4 max-w-xl">
        <SeriesForm action={createSeries} error={error} />
      </div>
    </div>
  );
}
