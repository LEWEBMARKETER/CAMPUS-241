import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Annuaire
// ---------------------------------------------------------------------------

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
    plan: "PRO" as const,
    verified: true,
    contactEmail: "contact@lycee-excellence-lbv.ga",
    contactPhone: "+241 01 23 45 67",
    websiteUrl: "https://lycee-excellence-lbv.ga",
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
    plan: "PRO" as const,
    verified: true,
    contactEmail: "contact@uob.ga",
    contactPhone: "+241 01 76 20 20",
    websiteUrl: "https://uob.ga",
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
    plan: "FREE" as const,
    verified: false,
    contactEmail: "admissions@ist-pg.ga",
    contactPhone: "+241 01 55 44 33",
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
    plan: "PRO" as const,
    verified: true,
    contactEmail: "contact@escg.ga",
    contactPhone: "+241 01 11 22 33",
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
    plan: "FREE" as const,
    verified: false,
    contactEmail: "contact@cfp-numerique241.ga",
    contactPhone: "+241 01 99 88 77",
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
    plan: "FREE" as const,
    verified: false,
    contactEmail: "scolarite@fml.ga",
    contactPhone: "+241 01 66 55 44",
  },
];

// ---------------------------------------------------------------------------
// CAMPUS BAC
// ---------------------------------------------------------------------------

const seriesData = [
  { code: "A", name: "Série A — Littéraire" },
  { code: "C", name: "Série C — Mathématiques et Physique" },
  { code: "D", name: "Série D — Mathématiques et SVT" },
];

const subjectsData = [
  { name: "Mathématiques", slug: "mathematiques", series: ["C", "D"] },
  { name: "Physique-Chimie", slug: "physique-chimie", series: ["C", "D"] },
  { name: "SVT", slug: "svt", series: ["D"] },
  { name: "Français", slug: "francais", series: ["A", "C", "D"] },
  { name: "Philosophie", slug: "philosophie", series: ["A", "C", "D"] },
];

const mathChapters = ["Suites", "Probabilités", "Fonctions", "Géométrie"];

const badgesData = [
  {
    code: "FIRST_SIMULATION",
    name: "Première simulation",
    description: "Complétez votre première simulation.",
    criteriaType: "FIRST_SIMULATION" as const,
    threshold: null,
  },
  {
    code: "5_SIMULATIONS",
    name: "5 simulations complétées",
    description: "Complétez 5 simulations.",
    criteriaType: "SIMULATIONS_COUNT" as const,
    threshold: 5,
  },
  {
    code: "100_QUESTIONS",
    name: "100 questions répondues",
    description: "Répondez à 100 questions au total.",
    criteriaType: "QUESTIONS_ANSWERED" as const,
    threshold: 100,
  },
  {
    code: "80_PERCENT_AVERAGE",
    name: "80% de moyenne",
    description: "Atteignez 80% de moyenne sur vos simulations.",
    criteriaType: "AVERAGE_SCORE" as const,
    threshold: 80,
  },
];

// ---------------------------------------------------------------------------
// CAMPUS RESSOURCES
// ---------------------------------------------------------------------------

const niveauxData = ["Collège", "Lycée", "Université"];
const domainesData = [
  "Sciences",
  "Droit",
  "Économie",
  "Gestion",
  "Informatique",
  "Médecine",
  "Communication",
];

const resourceSubjectsData = ["Comptabilité", "Droit des affaires", "Algorithmique"];

async function main() {
  // --- Nettoyage (ordre inverse des dépendances) -----------------------------
  await prisma.resourceDownload.deleteMany();
  await prisma.resourceView.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.resourceSubject.deleteMany();
  await prisma.resourceCategory.deleteMany();

  await prisma.userBadge.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.simulationAnswer.deleteMany();
  await prisma.simulation.deleteMany();
  await prisma.questionChoice.deleteMany();
  await prisma.question.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.seriesSubject.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.series.deleteMany();

  await prisma.brochureRequest.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.establishment.deleteMany();

  // --- Annuaire ---------------------------------------------------------------
  await prisma.establishment.createMany({ data: establishments });

  // --- CAMPUS BAC ---------------------------------------------------------------
  const series = new Map<string, string>();
  for (const s of seriesData) {
    const created = await prisma.series.create({
      data: { code: s.code, name: s.name },
    });
    series.set(s.code, created.id);
  }

  const subjects = new Map<string, string>();
  for (const s of subjectsData) {
    const created = await prisma.subject.create({
      data: { name: s.name, slug: s.slug },
    });
    subjects.set(s.slug, created.id);
    for (const code of s.series) {
      await prisma.seriesSubject.create({
        data: { seriesId: series.get(code)!, subjectId: created.id },
      });
    }
  }

  const mathSubjectId = subjects.get("mathematiques")!;
  const chapters = new Map<string, string>();
  for (const name of mathChapters) {
    const created = await prisma.chapter.create({
      data: { subjectId: mathSubjectId, name },
    });
    chapters.set(name, created.id);
  }

  const demoQuestions = [
    {
      chapter: "Suites",
      prompt: "Soit (u_n) une suite arithmétique de raison 3 et u_0 = 2. Quelle est la valeur de u_5 ?",
      choices: ["15", "17", "20", "12"],
      correctIndex: 1,
    },
    {
      chapter: "Suites",
      prompt: "Une suite géométrique de raison 2 et de premier terme 1 : quel est son 4e terme (u_3) ?",
      choices: ["6", "7", "8", "9"],
      correctIndex: 2,
    },
    {
      chapter: "Probabilités",
      prompt: "On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir un nombre pair ?",
      choices: ["1/6", "1/3", "1/2", "2/3"],
      correctIndex: 2,
    },
    {
      chapter: "Fonctions",
      prompt: "Quelle est la dérivée de f(x) = x² + 3x sur ℝ ?",
      choices: ["2x + 3", "x + 3", "2x", "x²"],
      correctIndex: 0,
    },
    {
      chapter: "Géométrie",
      prompt: "Dans un triangle rectangle, quelle relation relie les côtés (théorème de Pythagore) ?",
      choices: ["a + b = c", "a² + b² = c²", "a × b = c", "a² - b² = c²"],
      correctIndex: 1,
    },
  ];

  for (const q of demoQuestions) {
    await prisma.question.create({
      data: {
        seriesId: series.get("D")!,
        subjectId: mathSubjectId,
        chapterId: chapters.get(q.chapter)!,
        type: "QCM",
        difficulty: "MOYEN",
        prompt: q.prompt,
        published: true,
        choices: {
          create: q.choices.map((label, index) => ({
            label,
            isCorrect: index === q.correctIndex,
            order: index,
          })),
        },
      },
    });
  }

  await prisma.badge.createMany({ data: badgesData });

  // --- CAMPUS RESSOURCES ---------------------------------------------------------
  const niveaux = new Map<string, string>();
  for (const [index, name] of niveauxData.entries()) {
    const created = await prisma.resourceCategory.create({
      data: { name, slug: `niveau-${name.toLowerCase()}`, kind: "NIVEAU", order: index },
    });
    niveaux.set(name, created.id);
  }

  const domaines = new Map<string, string>();
  for (const [index, name] of domainesData.entries()) {
    const created = await prisma.resourceCategory.create({
      data: {
        name,
        slug: `domaine-${name.toLowerCase().replace(/\s+/g, "-")}`,
        kind: "DOMAINE",
        order: index,
      },
    });
    domaines.set(name, created.id);
  }

  const filiereLicence2Eco = await prisma.resourceCategory.create({
    data: {
      name: "Licence 2 Économie",
      slug: "filiere-licence-2-economie",
      kind: "FILIERE",
      parentId: domaines.get("Économie")!,
    },
  });

  const resourceSubjects = new Map<string, string>();
  for (const name of resourceSubjectsData) {
    const created = await prisma.resourceSubject.create({
      data: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
    });
    resourceSubjects.set(name, created.id);
  }

  await prisma.resource.createMany({
    data: [
      {
        title: "Cours de comptabilité analytique",
        slug: "cours-comptabilite-analytique",
        description: "Introduction aux méthodes de calcul des coûts en comptabilité analytique.",
        author: "Équipe CAMPUS 241",
        type: "COURS",
        format: "PDF",
        niveauId: niveaux.get("Université")!,
        domaineId: domaines.get("Économie")!,
        filiereId: filiereLicence2Eco.id,
        subjectId: resourceSubjects.get("Comptabilité")!,
        isPremium: true,
        status: "PUBLIE",
        publishedAt: new Date(),
      },
      {
        title: "Fiche de révision : les suites numériques",
        slug: "fiche-revision-suites-numeriques",
        description: "Résumé des formules essentielles sur les suites arithmétiques et géométriques.",
        author: "Équipe CAMPUS 241",
        type: "FICHE_REVISION",
        format: "PDF",
        niveauId: niveaux.get("Lycée")!,
        domaineId: domaines.get("Sciences")!,
        isPremium: false,
        status: "PUBLIE",
        publishedAt: new Date(),
      },
      {
        title: "Annales Bac 2025 — Mathématiques Série D",
        slug: "annales-bac-2025-mathematiques-serie-d",
        description: "Sujets et corrigés des épreuves de mathématiques de la session 2025.",
        author: "Équipe CAMPUS 241",
        type: "ANNALE",
        format: "PDF",
        niveauId: niveaux.get("Lycée")!,
        domaineId: domaines.get("Sciences")!,
        isPremium: false,
        status: "PUBLIE",
        publishedAt: new Date(),
      },
    ],
  });

  console.log(
    `Seed terminé : ${establishments.length} établissements, ${seriesData.length} séries, ${subjectsData.length} matières, ${mathChapters.length} chapitres, ${demoQuestions.length} questions, ${badgesData.length} badges, ${niveauxData.length + domainesData.length + 1} catégories ressources, 3 ressources.`,
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
