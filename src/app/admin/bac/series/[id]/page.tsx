import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SeriesForm } from "@/components/admin/series-form";
import { updateSeries } from "@/lib/actions/admin-bac-series";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Modifier la série" };

export default async function EditSeriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const series = await prisma.series.findUnique({ where: { id } });
  if (!series) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-neutral-900">Modifier {series.name}</h2>
      <div className="mt-4 max-w-xl">
        <SeriesForm series={series} action={updateSeries.bind(null, id)} error={error} />
      </div>
    </div>
  );
}
