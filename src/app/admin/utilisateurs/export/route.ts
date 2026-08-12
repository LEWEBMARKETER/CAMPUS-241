import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  await requireAdmin();

  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  const header = [
    "Nom",
    "Prenom",
    "Email",
    "WhatsApp",
    "Ville",
    "Niveau",
    "ClasseOuNiveauUniv",
    "Serie",
    "Role",
    "InscritLe",
  ];

  const rows = users.map((user) =>
    [
      user.nom,
      user.prenom,
      user.email,
      user.whatsapp ?? "",
      user.ville ?? "",
      user.niveau ?? "",
      user.classeOuNiveauUniv ?? "",
      user.serie ?? "",
      user.role,
      user.createdAt.toISOString(),
    ]
      .map((value) => csvEscape(String(value)))
      .join(","),
  );

  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="utilisateurs-campus241.csv"`,
    },
  });
}
