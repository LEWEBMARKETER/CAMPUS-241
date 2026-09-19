import "dotenv/config";
import { defineConfig } from "@prisma/config";

// La CLI Prisma (migrate, generate, ...) a besoin d'une connexion directe :
// les verrous consultatifs utilisés par `migrate deploy` ne fonctionnent pas
// via une connexion poolée (ex. PgBouncer côté Neon). Le client applicatif,
// lui, continue d'utiliser DATABASE_URL (poolée) via l'adaptateur dans
// src/lib/prisma.ts. DIRECT_URL est optionnelle : sans elle, on retombe sur
// DATABASE_URL (cas du Postgres local en dev, qui n'a pas de pooler).
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
