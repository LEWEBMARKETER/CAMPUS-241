import type { Metadata } from "next";
import { Download } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Gestion des utilisateurs" };

export default async function AdminUsersPage() {
  await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {users.length} utilisateur{users.length > 1 ? "s" : ""} inscrit
          {users.length > 1 ? "s" : ""}
        </p>
        <a
          href="/admin/utilisateurs/export"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <Download className="size-4" />
          Exporter en CSV
        </a>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/5 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Niveau</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {user.prenom} {user.nom}
                </td>
                <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                <td className="px-4 py-3 text-neutral-600">{user.ville ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{user.niveau ?? "—"}</td>
                <td className="px-4 py-3 text-neutral-600">{user.role}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {new Intl.DateTimeFormat("fr-FR").format(user.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
