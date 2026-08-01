import { GraduationCap } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export type EstablishmentCardProps = {
  name: string;
  type: string;
  city: string;
  isPartner?: boolean;
};

export function EstablishmentCard({
  name,
  type,
  city,
  isPartner,
}: EstablishmentCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
              {type} · {city}
            </CardDescription>
          </div>
        </div>
        {isPartner && (
          <span className="whitespace-nowrap rounded-full bg-brand-green-light px-2.5 py-1 text-xs font-medium text-brand-green-dark">
            Partenaire
          </span>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-500">Fiche établissement complète disponible au Sprint 2.</p>
      </CardContent>
    </Card>
  );
}
