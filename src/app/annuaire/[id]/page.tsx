import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GraduationCap, Mail, MapPin, Phone } from "lucide-react";

import { BrochureRequestForm } from "@/components/annuaire/brochure-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  ESTABLISHMENT_TYPE_LABELS,
  PUBLIC_PRIVATE_LABELS,
} from "@/lib/establishment";

async function getEstablishment(id: string) {
  return prisma.establishment.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const establishment = await getEstablishment(id);
  return { title: establishment?.name ?? "Établissement" };
}

export default async function EstablishmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const establishment = await getEstablishment(id);

  if (!establishment) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link
        href="/annuaire"
        className="text-sm font-medium text-brand-blue hover:underline"
      >
        ← Retour à l&apos;annuaire
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-light text-brand-blue">
              <GraduationCap className="size-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
                  {establishment.name}
                </h1>
                {establishment.isPartner && (
                  <span className="rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark">
                    Partenaire
                  </span>
                )}
              </div>
              <p className="mt-1 text-neutral-600">
                {ESTABLISHMENT_TYPE_LABELS[establishment.type]}
                {establishment.publicOrPrivate
                  ? ` · ${PUBLIC_PRIVATE_LABELS[establishment.publicOrPrivate]}`
                  : ""}
                {establishment.city ? ` · ${establishment.city}` : ""}
              </p>
            </div>
          </div>

          {establishment.description && (
            <p className="mt-6 text-neutral-700">{establishment.description}</p>
          )}

          {establishment.filieres.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-neutral-900">
                Filières
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {establishment.filieres.map((filiere) => (
                  <span
                    key={filiere}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
                  >
                    {filiere}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {establishment.niveauAdmission && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Niveau d&apos;admission
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600">
                  {establishment.niveauAdmission}
                </CardContent>
              </Card>
            )}
            {establishment.admissionInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admission</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600">
                  {establishment.admissionInfo}
                </CardContent>
              </Card>
            )}
            {establishment.budgetRange && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Budget indicatif</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-neutral-600">
                  {establishment.budgetRange}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-8 space-y-2 text-sm text-neutral-600">
            {establishment.address && (
              <p className="flex items-center gap-2">
                <MapPin className="size-4 text-brand-blue" />
                {establishment.address}
              </p>
            )}
            {establishment.contactPhone && (
              <p className="flex items-center gap-2">
                <Phone className="size-4 text-brand-blue" />
                {establishment.contactPhone}
              </p>
            )}
            {establishment.contactEmail && (
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-brand-blue" />
                {establishment.contactEmail}
              </p>
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Demander la brochure</CardTitle>
            </CardHeader>
            <CardContent>
              <BrochureRequestForm establishmentId={establishment.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
