import Link from "next/link";
import { BadgeCheck, GraduationCap, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ESTABLISHMENT_LEVEL_LABELS, PUBLIC_PRIVATE_LABELS } from "@/lib/establishment";
import type { EstablishmentLevel, PublicOrPrivate } from "@prisma/client";

export type EstablishmentCardProps = {
  id: string;
  name: string;
  logoUrl?: string | null;
  publicOrPrivate: PublicOrPrivate;
  levels: EstablishmentLevel[];
  city: string | null;
  verified: boolean;
  description?: string | null;
};

export function EstablishmentCard({
  id,
  name,
  logoUrl,
  publicOrPrivate,
  levels,
  city,
  verified,
  description,
}: EstablishmentCardProps) {
  return (
    <Link href={`/annuaire/${id}`} className="block">
      <Card className="h-full">
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-blue-light text-brand-blue">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- logos hébergés sur des domaines arbitraires (URL collée par l'admin)
                <img src={logoUrl} alt="" className="size-11 object-cover" />
              ) : (
                <GraduationCap className="size-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <CardTitle>{name}</CardTitle>
                {verified && <BadgeCheck className="size-4 shrink-0 text-brand-green" />}
              </div>
              <p className="mt-0.5 text-sm text-neutral-500">
                {PUBLIC_PRIVATE_LABELS[publicOrPrivate]}
                {levels.length > 0
                  ? ` · ${levels.map((level) => ESTABLISHMENT_LEVEL_LABELS[level]).join(", ")}`
                  : ""}
              </p>
              {city && (
                <p className="mt-0.5 flex items-center gap-1 text-sm text-neutral-500">
                  <MapPin className="size-3.5" />
                  {city}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        {description && (
          <CardContent>
            <p className="line-clamp-2 text-sm text-neutral-500">{description}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
