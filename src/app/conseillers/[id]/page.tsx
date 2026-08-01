import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MessageCircle, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { whatsappLink } from "@/lib/whatsapp";

async function getAdvisor(id: string) {
  return prisma.advisor.findUnique({ where: { id } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const advisor = await getAdvisor(id);
  return { title: advisor?.name ?? "Conseiller" };
}

export default async function ConseillerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const advisor = await getAdvisor(id);

  if (!advisor) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/conseillers"
        className="text-sm font-medium text-brand-blue hover:underline"
      >
        ← Retour aux conseillers
      </Link>

      <div className="mt-4 flex items-start gap-4">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand-green-light text-brand-green-dark">
          <UserRound className="size-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            {advisor.name}
          </h1>
          <p className="mt-1 text-neutral-600">
            {[advisor.specialty, advisor.city].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      {advisor.bio && <p className="mt-6 text-neutral-700">{advisor.bio}</p>}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {advisor.whatsapp && (
          <Button asChild variant="secondary">
            <a
              href={whatsappLink(
                advisor.whatsapp,
                `Bonjour ${advisor.name}, je vous contacte via CAMPUS 241.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="size-4" />
              Contacter sur WhatsApp
            </a>
          </Button>
        )}
        {advisor.calendlyUrl && (
          <Button asChild variant="outline">
            <a
              href={advisor.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CalendarDays className="size-4" />
              Prendre rendez-vous
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
