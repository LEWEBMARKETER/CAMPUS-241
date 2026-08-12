import Link from "next/link";
import { BookOpen, Lock } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RESOURCE_TYPE_LABELS } from "@/lib/resources";
import type { ResourceType } from "@prisma/client";

export type ResourceCardProps = {
  slug: string;
  title: string;
  type: ResourceType;
  isPremium: boolean;
  niveauName?: string | null;
  matiereName?: string | null;
  description?: string | null;
};

export function ResourceCard({
  slug,
  title,
  type,
  isPremium,
  niveauName,
  matiereName,
  description,
}: ResourceCardProps) {
  return (
    <Link href={`/ressources/${slug}`} className="block">
      <Card className="h-full">
        <CardHeader className="flex-row items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
              <BookOpen className="size-5" />
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>
                {RESOURCE_TYPE_LABELS[type]}
                {matiereName ? ` · ${matiereName}` : ""}
                {niveauName ? ` · ${niveauName}` : ""}
              </CardDescription>
            </div>
          </div>
          {isPremium && (
            <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-brand-gold/30 px-2.5 py-1 text-xs font-medium text-brand-blue">
              <Lock className="size-3" />
              Premium
            </span>
          )}
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
