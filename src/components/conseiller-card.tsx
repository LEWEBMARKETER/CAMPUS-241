import Link from "next/link";
import { UserRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export type ConseillerCardProps = {
  id: string;
  name: string;
  specialty: string | null;
  city: string | null;
  bio?: string | null;
};

export function ConseillerCard({ id, name, specialty, city, bio }: ConseillerCardProps) {
  return (
    <Link href={`/conseillers/${id}`} className="block">
      <Card className="h-full">
        <CardHeader className="flex-row items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green-dark">
            <UserRound className="size-5" />
          </div>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>
              {[specialty, city].filter(Boolean).join(" · ")}
            </CardDescription>
          </div>
        </CardHeader>
        {bio && (
          <CardContent>
            <p className="line-clamp-2 text-sm text-neutral-500">{bio}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
