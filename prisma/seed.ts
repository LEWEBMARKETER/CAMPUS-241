import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const establishments = [
  {
    name: "Lycée d'Excellence de Libreville",
    type: "COLLEGE_LYCEE" as const,
    description:
      "Établissement secondaire réputé pour son accompagnement personnalisé et ses résultats au Baccalauréat.",
    city: "Libreville",
    country: "Gabon",
    address: "Quartier Glass, Libreville",
    publicOrPrivate: "PRIVE" as const,
    filieres: ["Sciences", "Lettres & Sciences humaines"],
    niveauAdmission: "Seconde à Terminale",
    admissionInfo: "Dossier scolaire + entretien de motivation.",
    budgetRange: "500 000 - 1 000 000 FCFA/an",
    isPartner: true,
    contactEmail: "contact@lycee-excellence-lbv.ga",
    contactPhone: "+241 01 23 45 67",
    photos: [] as string[],
  },
  {
    name: "Université Omar Bongo",
    type: "UNIVERSITE" as const,
    description:
      "La plus grande université publique du Gabon, offrant un large éventail de filières académiques.",
    city: "Libreville",
    country: "Gabon",
    address: "Boulevard Léon Mba, Libreville",
    publicOrPrivate: "PUBLIC" as const,
    filieres: ["Droit", "Lettres & Sciences humaines", "Sciences"],
    niveauAdmission: "Bac requis",
    admissionInfo: "Inscription en ligne via le portail national.",
    budgetRange: "Moins de 500 000 FCFA/an",
    isPartner: true,
    contactEmail: "contact@uob.ga",
    contactPhone: "+241 01 76 20 20",
    photos: [] as string[],
  },
  {
    name: "Institut Supérieur de Technologie",
    type: "GRANDE_ECOLE" as const,
    description:
      "Grande école formant aux métiers du numérique, de l'ingénierie et du management de projet.",
    city: "Port-Gentil",
    country: "Gabon",
    address: "Zone industrielle, Port-Gentil",
    publicOrPrivate: "PRIVE" as const,
    filieres: ["Informatique", "Ingénierie"],
    niveauAdmission: "Bac + concours",
    admissionInfo: "Concours d'entrée en juillet, dossier + tests écrits.",
    budgetRange: "1 000 000 - 2 000 000 FCFA/an",
    isPartner: false,
    contactEmail: "admissions@ist-pg.ga",
    contactPhone: "+241 01 55 44 33",
    photos: [] as string[],
  },
  {
    name: "École Supérieure de Commerce du Gabon",
    type: "GRANDE_ECOLE" as const,
    description:
      "Formation en commerce, gestion et entrepreneuriat, orientée vers l'insertion professionnelle rapide.",
    city: "Libreville",
    country: "Gabon",
    address: "Quartier Louis, Libreville",
    publicOrPrivate: "PRIVE" as const,
    filieres: ["Commerce & Gestion"],
    niveauAdmission: "Bac requis",
    admissionInfo: "Dossier de candidature + entretien.",
    budgetRange: "1 000 000 - 2 000 000 FCFA/an",
    isPartner: true,
    contactEmail: "contact@escg.ga",
    contactPhone: "+241 01 11 22 33",
    photos: [] as string[],
  },
  {
    name: "Centre de Formation Professionnelle Numérique 241",
    type: "CENTRE_FORMATION" as const,
    description:
      "Centre de formation courte durée aux métiers du digital : développement web, marketing digital, design.",
    city: "Libreville",
    country: "Gabon",
    address: "Quartier Nombakélé, Libreville",
    publicOrPrivate: "PRIVE" as const,
    filieres: ["Informatique", "Communication"],
    niveauAdmission: "Ouvert à partir de la Terminale",
    admissionInfo: "Inscription continue, sessions tous les trimestres.",
    budgetRange: "Moins de 500 000 FCFA/an",
    isPartner: false,
    contactEmail: "contact@cfp-numerique241.ga",
    contactPhone: "+241 01 99 88 77",
    photos: [] as string[],
  },
  {
    name: "Faculté de Médecine de Libreville",
    type: "UNIVERSITE" as const,
    description:
      "Formation médicale publique, du premier cycle jusqu'à la spécialisation.",
    city: "Libreville",
    country: "Gabon",
    address: "Owendo, Libreville",
    publicOrPrivate: "PUBLIC" as const,
    filieres: ["Santé"],
    niveauAdmission: "Bac scientifique requis",
    admissionInfo: "Concours d'entrée en première année.",
    budgetRange: "Moins de 500 000 FCFA/an",
    isPartner: false,
    contactEmail: "scolarite@fml.ga",
    contactPhone: "+241 01 66 55 44",
    photos: [] as string[],
  },
];

const advisors = [
  {
    name: "Nadège Ondo",
    specialty: "Orientation post-Bac scientifique",
    city: "Libreville",
    bio: "Conseillère d'orientation depuis 8 ans, spécialisée dans les filières scientifiques et de santé.",
    whatsapp: "+241 01 23 45 67",
    calendlyUrl: "https://calendly.com/nadege-ondo",
  },
  {
    name: "Éric Mba",
    specialty: "Grandes écoles & concours",
    city: "Port-Gentil",
    bio: "Ancien enseignant, accompagne les élèves dans la préparation des concours d'entrée en grande école.",
    whatsapp: "+241 01 76 20 20",
    calendlyUrl: "https://calendly.com/eric-mba",
  },
  {
    name: "Sylvie Nzamba",
    specialty: "Orientation universitaire & lettres",
    city: "Libreville",
    bio: "Conseillère pédagogique, spécialisée dans les filières lettres, droit et sciences humaines.",
    whatsapp: "+241 01 55 44 33",
    calendlyUrl: "https://calendly.com/sylvie-nzamba",
  },
];

const leadMagnets = [
  {
    title: "Guide gratuit : réussir son orientation post-Bac",
    description:
      "Un guide complet pour comprendre les filières et faire les bons choix après le Bac.",
    fileUrl: "https://example.com/guides/orientation-post-bac.pdf",
  },
  {
    title: "Checklist de révisions Bac 2026",
    description:
      "La checklist pour organiser ses révisions semaine par semaine avant les examens.",
    fileUrl: "https://example.com/guides/checklist-bac-2026.pdf",
  },
];

async function main() {
  await prisma.download.deleteMany();
  await prisma.brochureRequest.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.establishment.deleteMany();
  await prisma.advisor.deleteMany();
  await prisma.leadMagnet.deleteMany();

  await prisma.establishment.createMany({ data: establishments });
  await prisma.advisor.createMany({ data: advisors });
  await prisma.leadMagnet.createMany({ data: leadMagnets });

  console.log(
    `Seed terminé : ${establishments.length} établissements, ${advisors.length} conseillers, ${leadMagnets.length} guides gratuits.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
