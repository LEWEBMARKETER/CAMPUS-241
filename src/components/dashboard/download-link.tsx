"use client";

import { useTransition } from "react";
import { Download as DownloadIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { recordDownload } from "@/lib/actions/downloads";
import { cn } from "@/lib/utils";

export function DownloadLink({
  leadMagnetId,
  fileUrl,
  downloaded,
}: {
  leadMagnetId: string;
  fileUrl: string;
  downloaded: boolean;
}) {
  const [, startTransition] = useTransition();

  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => startTransition(() => recordDownload(leadMagnetId))}
      className={cn(buttonVariants({ variant: downloaded ? "outline" : "default", size: "sm" }))}
    >
      <DownloadIcon className="size-4" />
      {downloaded ? "Télécharger à nouveau" : "Télécharger"}
    </a>
  );
}
