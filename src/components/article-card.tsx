import { Newspaper } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export type ArticleCardProps = {
  title: string;
  excerpt: string;
  category: string;
};

export function ArticleCard({ title, excerpt, category }: ArticleCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex size-11 items-center justify-center rounded-xl bg-brand-blue-light text-brand-blue">
          <Newspaper className="size-5" />
        </div>
        <span className="mt-2 text-xs font-medium uppercase tracking-wide text-brand-blue">
          {category}
        </span>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{excerpt}</CardDescription>
      </CardContent>
    </Card>
  );
}
