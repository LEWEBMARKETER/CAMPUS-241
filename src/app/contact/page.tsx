import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Contact" };

const contactChannels = [
  {
    icon: Mail,
    title: "Email",
    value: "contact@campus241.com",
    href: "mailto:contact@campus241.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "Discuter avec l'équipe CAMPUS 241",
    href: "https://wa.me/",
  },
  {
    icon: MapPin,
    title: "Zone d'action",
    value: "Gabon",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
        Contactez-nous
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        Une question sur l&apos;orientation, un établissement ou un
        partenariat ? Notre équipe vous répond rapidement.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {contactChannels.map(({ icon: Icon, title, value, href }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-6 text-brand-blue" />
              <CardTitle className="mt-2 text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              {href ? (
                <a
                  href={href}
                  className="text-sm text-neutral-600 hover:text-brand-blue"
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {value}
                </a>
              ) : (
                <p className="text-sm text-neutral-600">{value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
