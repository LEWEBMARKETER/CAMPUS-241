import Link from "next/link";
import { GraduationCap } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ESTABLISHMENT_TYPE_LABELS } from "@/lib/establishment";
import type { EstablishmentType } from "@prisma/client";

export type EstablishmentCardProps = {
  id: string;
  name: string;
  type: EstablishmentType;
  city: string | null;
  isPartner: boolean;
  description?: string | null;
};

export function EstablishmentCard({
  id,
  name,
  type,
  city,
  isPartner,
  description,
}: EstablishmentCardProps) {
  return (
    <Link href={`/annuaire/${id}`} className="block">
      <Card className="h-full">
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <CardTitle>{name}</CardTitle>
              <CardDescription>
                {ESTABLISHMENT_TYPE_LABELS[type]}
                {city ? ` · ${city}` : ""}
              </CardDescription>
            </div>
          </div>
          {isPartner && (
            <span className="whitespace-nowrap rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark">
              Partenaire
            </span>
          )}
        </CardHeader>
        {description && (
          <CardContent>
            <p className="line-clamp-2 text-sm text-neutral-500">
              {description}
            </p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
