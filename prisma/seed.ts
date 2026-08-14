import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import type { EstablishmentLevel } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Annuaire
// ---------------------------------------------------------------------------

const establishments = [
  {
    name: "École Primaire Publique de Glass",
    acronym: "EPP Glass",
    description: "École primaire publique accueillant les enfants du CP au CM2.",
    publicOrPrivate: "PUBLIC" as const,
    levels: ["PRIMAIRE"] as EstablishmentLevel[],
    province: "Estuaire",
    city: "Libreville",
    district: "Glass",
    address: "Quartier Glass, Libreville",
    classesOffered: ["CP", "CE1", "CE2", "CM1", "CM2"],
    phone: "+241 01 22 33 44",
    verified: true,
  },
  {
    name: "Lycée d'Excellence de Libreville",
    acronym: "LEL",
    description:
      "Établissement secondaire réputé pour son accompagnement personnalisé et ses résultats au Baccalauréat.",
    publicOrPrivate: "PRIVE" as const,
    levels: ["COLLEGE", "LYCEE"] as EstablishmentLevel[],
    province: "Estuaire",
    city: "Libreville",
    district: "Glass",
    address: "Quartier Glass, Libreville",
    classesOffered: ["6e", "5e", "4e", "3e", "2nde", "1re", "Tle"],
    phone: "+241 01 23 45 67",
    whatsapp: "+241 01 23 45 67",
    email: "contact@lycee-excellence-lbv.ga",
    websiteUrl: "https://lycee-excellence-lbv.ga",
    admissionConditions: "Dossier scolaire + entretien de motivation.",
    registrationPeriod: "Juin à septembre",
    tuitionFees: "500 000 - 1 000 000 FCFA/an",
    schedule: "Lundi-Vendredi 7h30-15h30",
    verified: true,
  },
  {
    name: "Université Omar Bongo",
    acronym: "UOB",
    description:
      "La plus grande université publique du Gabon, offrant un large éventail de filières académiques.",
    publicOrPrivate: "PUBLIC" as const,
    levels: ["SUPERIEUR"] as EstablishmentLevel[],
    province: "Estuaire",
    city: "Libreville",
    district: "Charbonnages",
    address: "Boulevard Léon Mba, Libreville",
    filieresSuperieur: ["Droit", "Lettres et sciences humaines", "Sciences"],
    diplomasOffered: ["Licence", "Master", "Doctorat"],
    phone: "+241 01 76 20 20",
    email: "contact@uob.ga",
    websiteUrl: "https://uob.ga",
    admissionConditions: "Baccalauréat requis, inscription en ligne via le portail national.",
    registrationPeriod: "Août à octobre",
    tuitionFees: "Moins de 500 000 FCFA/an",
    verified: true,
  },
  {
    name: "Institut Supérieur de Technologie",
    acronym: "IST",
    description:
      "Grande école formant aux métiers du numérique, de l'ingénierie et du management de projet.",
    publicOrPrivate: "PRIVE" as const,
    levels: ["SUPERIEUR"] as EstablishmentLevel[],
    province: "Ogooué-Maritime",
    city: "Port-Gentil",
    address: "Zone industrielle, Port-Gentil",
    filieresSuperieur: ["Informatique", "Ingénierie"],
    diplomasOffered: ["Licence", "Master"],
    phone: "+241 01 55 44 33",
    email: "admissions@ist-pg.ga",
    admissionConditions: "Concours d'entrée en juillet : dossier + tests écrits.",
    tuitionFees: "1 000 000 - 2 000 000 FCFA/an",
    verified: false,
  },
  {
    name: "École Supérieure de Commerce du Gabon",
    acronym: "ESCG",
    description:
      "Formation en commerce, gestion et entrepreneuriat, orientée vers l'insertion professionnelle rapide.",
    publicOrPrivate: "PRIVE" as const,
    levels: ["SUPERIEUR"] as EstablishmentLevel[],
    province: "Estuaire",
    city: "Libreville",
    district: "Louis",
    address: "Quartier Louis, Libreville",
    filieresSuperieur: ["Commerce et gestion"],
    diplomasOffered: ["Licence", "Master"],
    phone: "+241 01 11 22 33",
    email: "contact@escg.ga",
    admissionConditions: "Dossier de candidature + entretien.",
    tuitionFees: "1 000 000 - 2 000 000 FCFA/an",
    verified: true,
  },
  {
    name: "Centre de Formation Professionnelle Numérique 241",
    acronym: "CFP Numérique 241",
    description:
      "Centre de formation courte durée aux métiers du digital : développement web, marketing digital, design.",
    publicOrPrivate: "PRIVE" as const,
    levels: ["SUPERIEUR"] as EstablishmentLevel[],
    province: "Estuaire",
    city: "Libreville",
    district: "Nombakélé",
    address: "Quartier Nombakélé, Libreville",
    filieresSuperieur: ["Informatique", "Communication"],
    diplomasOffered: ["Certificat professionnel"],
    phone: "+241 01 99 88 77",
    email: "contact@cfp-numerique241.ga",
    admissionConditions: "Ouvert à partir de la Terminale, inscription continue.",
    registrationPeriod: "Sessions tous les trimestres",
    tuitionFees: "Moins de 500 000 FCFA/an",
    verified: false,
  },
  {
    name: "Faculté de Médecine de Libreville",
    acronym: "FML",
    description: "Formation médicale publique, du premier cycle jusqu'à la spécialisation.",
    publicOrPrivate: "PUBLIC" as const,
    levels: ["SUPERIEUR"] as EstablishmentLevel[],
    province: "Estuaire",
    city: "Libreville",
    district: "Owendo",
    address: "Owendo, Libreville",
    filieresSuperieur: ["Santé"],
    diplomasOffered: ["Doctorat en médecine"],
    phone: "+241 01 66 55 44",
    email: "scolarite@fml.ga",
    admissionConditions: "Baccalauréat scientifique requis, concours d'entrée en première année.",
    verified: false,
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
        difficulty: "NIVEAU_2_APPLICATION",
        prompt: q.prompt,
        published: true,
        validationStatus: "VALIDEE",
        validatedAt: new Date(),
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

  // Lot de démonstration du workflow de validation pédagogique (Sprint 10) :
  // contenu original, jamais dérivé d'une épreuve réelle, explicitement en attente
  // de validation par un enseignant/validateur pédagogique avant toute publication.
  const DEMO_SOURCE = "Contenu pédagogique original CAMPUS 241 (banque de démonstration)";

  type DraftQuestion = {
    chapter: string;
    notion: string;
    competency: string;
    difficulty:
      | "NIVEAU_1_FONDAMENTAL"
      | "NIVEAU_2_APPLICATION"
      | "NIVEAU_3_RAISONNEMENT"
      | "NIVEAU_4_AVANCE"
      | "NIVEAU_5_EXAMEN";
    frequencyTier: "TRES_FREQUENTE" | "FREQUENTE" | "OCCASIONNELLE" | "RARE";
    prompt: string;
    explanation: string;
    method: string;
    commonMistake: string;
    estimatedTimeSeconds: number;
  } & (
    | { type: "QCM"; choices: string[]; correctIndex: number }
    | { type: "VRAI_FAUX"; correctAnswerText: "vrai" | "faux" }
    | { type: "REPONSE_COURTE"; correctAnswerText: string }
  );

  const draftQuestions: DraftQuestion[] = [
    {
      chapter: "Suites",
      notion: "Suite arithmétique - terme général",
      competency: "Calculer un terme à partir de u_0 et de la raison",
      difficulty: "NIVEAU_1_FONDAMENTAL",
      frequencyTier: "TRES_FREQUENTE",
      type: "QCM",
      prompt: "Soit (u_n) une suite arithmétique de raison 4 et u_0 = 1. Quelle est la valeur de u_6 ?",
      choices: ["21", "24", "25", "28"],
      correctIndex: 2,
      explanation: "u_6 = u_0 + 6 × raison = 1 + 6 × 4 = 25.",
      method: "Utiliser la formule du terme général : u_n = u_0 + n × r.",
      commonMistake: "Confondre u_6 (7e terme) avec 6 × r sans ajouter u_0, ou décaler l'indice.",
      estimatedTimeSeconds: 60,
    },
    {
      chapter: "Suites",
      notion: "Somme des termes d'une suite géométrique",
      competency: "Calculer la somme des premiers termes d'une suite géométrique",
      difficulty: "NIVEAU_3_RAISONNEMENT",
      frequencyTier: "FREQUENTE",
      type: "QCM",
      prompt: "Soit (u_n) une suite géométrique de premier terme u_0 = 1 et de raison 3. Que vaut u_0+u_1+u_2+u_3 ?",
      choices: ["27", "36", "40", "13"],
      correctIndex: 2,
      explanation: "Somme = u_0 × (1 - r^4)/(1 - r) = 1 × (1 - 81)/(1 - 3) = -80/-2 = 40.",
      method: "Appliquer la formule de la somme géométrique S = u_0 × (1 - r^(n+1))/(1 - r) avec r ≠ 1.",
      commonMistake: "Additionner les termes un par un sans vérifier, ou utiliser la formule arithmétique par erreur.",
      estimatedTimeSeconds: 120,
    },
    {
      chapter: "Suites",
      notion: "Limite d'une suite géométrique",
      competency: "Déterminer la nature de la convergence selon la raison",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "OCCASIONNELLE",
      type: "VRAI_FAUX",
      prompt: "Une suite géométrique de raison q = 0,5 et de premier terme strictement positif converge vers 0.",
      correctAnswerText: "vrai",
      explanation: "Pour |q| < 1, une suite géométrique (u_n) converge vers 0, quel que soit le signe de u_0.",
      method: "Rappeler le théorème : si -1 < q < 1, alors lim u_n = 0.",
      commonMistake: "Croire qu'une suite géométrique de raison positive ne peut pas tendre vers 0.",
      estimatedTimeSeconds: 45,
    },
    {
      chapter: "Suites",
      notion: "Suite définie par récurrence",
      competency: "Calculer les premiers termes d'une suite récurrente",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "FREQUENTE",
      type: "REPONSE_COURTE",
      prompt: "Soit (u_n) définie par u_0 = 2 et u_(n+1) = 2u_n + 1. Quelle est la valeur de u_2 ?",
      correctAnswerText: "11",
      explanation: "u_1 = 2×2+1 = 5, puis u_2 = 2×5+1 = 11.",
      method: "Calculer les termes un à un en appliquant la relation de récurrence à partir de u_0.",
      commonMistake: "Appliquer la formule à u_0 directement pour obtenir u_2 en sautant l'étape u_1.",
      estimatedTimeSeconds: 90,
    },
    {
      chapter: "Suites",
      notion: "Sens de variation d'une suite",
      competency: "Étudier la monotonie d'une suite définie explicitement",
      difficulty: "NIVEAU_3_RAISONNEMENT",
      frequencyTier: "OCCASIONNELLE",
      type: "QCM",
      prompt: "Soit u_n = n² - 6n pour n ≥ 0. À partir de quel rang la suite est-elle strictement croissante ?",
      choices: ["n ≥ 0", "n ≥ 3", "n ≥ 4", "Jamais croissante"],
      correctIndex: 1,
      explanation: "u_(n+1) - u_n = 2n - 5, qui est strictement positif dès que n ≥ 3 (n entier). Donc pour tout n ≥ 3, u_(n+1) > u_n : la suite est strictement croissante à partir du rang 3.",
      method: "Étudier le signe de u_(n+1) - u_n en fonction de n.",
      commonMistake: "Étudier le signe de la dérivée de la fonction associée sans vérifier que l'étude est cohérente avec des valeurs entières.",
      estimatedTimeSeconds: 150,
    },
    {
      chapter: "Probabilités",
      notion: "Événements indépendants",
      competency: "Calculer la probabilité de l'intersection de deux événements indépendants",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "TRES_FREQUENTE",
      type: "QCM",
      prompt: "Deux événements A et B sont indépendants avec P(A) = 0,4 et P(B) = 0,5. Que vaut P(A ∩ B) ?",
      choices: ["0,9", "0,2", "0,1", "0,45"],
      correctIndex: 1,
      explanation: "Pour des événements indépendants, P(A ∩ B) = P(A) × P(B) = 0,4 × 0,5 = 0,2.",
      method: "Utiliser la définition de l'indépendance : P(A ∩ B) = P(A) × P(B).",
      commonMistake: "Additionner les probabilités au lieu de les multiplier.",
      estimatedTimeSeconds: 60,
    },
    {
      chapter: "Probabilités",
      notion: "Probabilités conditionnelles",
      competency: "Calculer une probabilité conditionnelle à partir d'un tableau ou d'un arbre",
      difficulty: "NIVEAU_4_AVANCE",
      frequencyTier: "TRES_FREQUENTE",
      type: "QCM",
      prompt: "Sachant P(A) = 0,3, P(B) = 0,6 et P(A ∩ B) = 0,18, quelle est la probabilité de A sachant B, P_B(A) ?",
      choices: ["0,18", "0,3", "0,5", "0,6"],
      correctIndex: 1,
      explanation: "P_B(A) = P(A ∩ B) / P(B) = 0,18 / 0,6 = 0,3.",
      method: "Appliquer la formule P_B(A) = P(A ∩ B) / P(B), avec P(B) ≠ 0.",
      commonMistake: "Diviser P(B) par P(A ∩ B) au lieu de l'inverse, ou confondre P_B(A) avec P_A(B).",
      estimatedTimeSeconds: 90,
    },
    {
      chapter: "Probabilités",
      notion: "Événement contraire",
      competency: "Utiliser la relation P(A) + P(non A) = 1",
      difficulty: "NIVEAU_1_FONDAMENTAL",
      frequencyTier: "FREQUENTE",
      type: "VRAI_FAUX",
      prompt: "Si P(A) = 0,35, alors la probabilité de l'événement contraire de A est 0,65.",
      correctAnswerText: "vrai",
      explanation: "P(non A) = 1 - P(A) = 1 - 0,35 = 0,65.",
      method: "Rappeler que P(A) + P(non A) = 1 pour tout événement A.",
      commonMistake: "Oublier cette relation et tenter un calcul plus complexe inutilement.",
      estimatedTimeSeconds: 30,
    },
    {
      chapter: "Probabilités",
      notion: "Espérance mathématique",
      competency: "Calculer l'espérance d'une variable aléatoire discrète",
      difficulty: "NIVEAU_3_RAISONNEMENT",
      frequencyTier: "OCCASIONNELLE",
      type: "REPONSE_COURTE",
      prompt: "Une variable aléatoire X prend les valeurs 1, 2 et 3 avec les probabilités 0,2 ; 0,3 et 0,5. Quelle est E(X) ? (répondre avec une virgule, ex : 2,3)",
      correctAnswerText: "2,3",
      explanation: "E(X) = 1×0,2 + 2×0,3 + 3×0,5 = 0,2 + 0,6 + 1,5 = 2,3.",
      method: "Appliquer E(X) = Σ x_i × P(X = x_i).",
      commonMistake: "Faire une simple moyenne arithmétique des valeurs sans tenir compte des probabilités.",
      estimatedTimeSeconds: 100,
    },
    {
      chapter: "Probabilités",
      notion: "Dénombrement",
      competency: "Dénombrer des tirages simultanés (combinaisons)",
      difficulty: "NIVEAU_3_RAISONNEMENT",
      frequencyTier: "RARE",
      type: "QCM",
      prompt: "Combien de comités de 3 personnes peut-on former parmi 6 personnes ?",
      choices: ["18", "20", "15", "120"],
      correctIndex: 1,
      explanation: "C(6,3) = 6! / (3! × 3!) = 20.",
      method: "Utiliser le nombre de combinaisons C(n,k) = n! / (k!(n-k)!) car l'ordre ne compte pas.",
      commonMistake: "Utiliser les arrangements (ordre compte) au lieu des combinaisons.",
      estimatedTimeSeconds: 90,
    },
    {
      chapter: "Fonctions",
      notion: "Dérivée d'un produit",
      competency: "Dériver une fonction produit de deux fonctions usuelles",
      difficulty: "NIVEAU_3_RAISONNEMENT",
      frequencyTier: "FREQUENTE",
      type: "QCM",
      prompt: "Quelle est la dérivée de f(x) = (x + 1)(x - 2) sur ℝ ?",
      choices: ["2x - 1", "2x + 1", "x - 1", "2x - 2"],
      correctIndex: 0,
      explanation: "f'(x) = 1×(x-2) + (x+1)×1 = (x-2) + (x+1) = 2x - 1.",
      method: "Appliquer la formule (uv)' = u'v + uv'.",
      commonMistake: "Développer f(x) = x² - x - 2 correctement mais dériver de tête sans vérifier le terme en x.",
      estimatedTimeSeconds: 90,
    },
    {
      chapter: "Fonctions",
      notion: "Étude de variations",
      competency: "Étudier le sens de variation à partir du signe de la dérivée",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "TRES_FREQUENTE",
      type: "QCM",
      prompt: "Soit f(x) = -x² + 4x sur ℝ. Sur quel intervalle f est-elle croissante ?",
      choices: ["]-∞ ; 2]", "[2 ; +∞[", "]-∞ ; +∞[", "[0 ; 4]"],
      correctIndex: 0,
      explanation: "f'(x) = -2x + 4, positive pour x < 2. f est donc croissante sur ]-∞ ; 2].",
      method: "Calculer f'(x), étudier son signe, puis en déduire le tableau de variations.",
      commonMistake: "Inverser le sens de variation en oubliant que le coefficient de x² est négatif.",
      estimatedTimeSeconds: 100,
    },
    {
      chapter: "Fonctions",
      notion: "Limites de fonctions",
      competency: "Déterminer la limite d'une fonction polynôme en +∞ ou -∞",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "FREQUENTE",
      type: "VRAI_FAUX",
      prompt: "La limite de f(x) = -3x² + x + 1 quand x tend vers +∞ est +∞.",
      correctAnswerText: "faux",
      explanation: "En +∞, la limite d'un polynôme est celle de son terme de plus haut degré : lim(-3x²) = -∞.",
      method: "Ne conserver que le terme de plus haut degré pour déterminer la limite en +∞ ou -∞.",
      commonMistake: "Oublier de tenir compte du signe négatif du coefficient dominant.",
      estimatedTimeSeconds: 60,
    },
    {
      chapter: "Fonctions",
      notion: "Équation de la tangente",
      competency: "Déterminer l'équation de la tangente à une courbe en un point",
      difficulty: "NIVEAU_4_AVANCE",
      frequencyTier: "OCCASIONNELLE",
      type: "REPONSE_COURTE",
      prompt: "Soit f(x) = x². Quelle est l'équation de la tangente à la courbe de f au point d'abscisse 2 ? (sous la forme y = ax + b, donner uniquement la valeur de a)",
      correctAnswerText: "4",
      explanation: "f'(x) = 2x, donc f'(2) = 4 : le coefficient directeur de la tangente est a = 4.",
      method: "La tangente en x_0 a pour équation y = f'(x_0)(x - x_0) + f(x_0) ; a correspond à f'(x_0).",
      commonMistake: "Confondre f(2) = 4 (l'ordonnée) avec f'(2) (le coefficient directeur), qui valent ici la même chose par coïncidence — bien vérifier la méthode plutôt que le résultat.",
      estimatedTimeSeconds: 120,
    },
    {
      chapter: "Fonctions",
      notion: "Dérivée d'une fonction composée",
      competency: "Dériver une fonction de la forme f(ax+b)",
      difficulty: "NIVEAU_5_EXAMEN",
      frequencyTier: "RARE",
      type: "QCM",
      prompt: "Quelle est la dérivée de g(x) = (2x + 1)² sur ℝ ?",
      choices: ["2(2x+1)", "4(2x+1)", "(2x+1)", "4x+1"],
      correctIndex: 1,
      explanation: "Avec u(x) = 2x+1, g = u², g' = 2u'×u = 2×2×(2x+1) = 4(2x+1).",
      method: "Utiliser la formule de dérivation composée (u^n)' = n×u'×u^(n-1).",
      commonMistake: "Oublier de multiplier par u'(x) = 2 (dérivée de la fonction intérieure).",
      estimatedTimeSeconds: 120,
    },
    {
      chapter: "Géométrie",
      notion: "Vecteurs colinéaires",
      competency: "Déterminer si deux vecteurs sont colinéaires",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "FREQUENTE",
      type: "VRAI_FAUX",
      prompt: "Les vecteurs u(2 ; 4) et v(3 ; 6) sont colinéaires.",
      correctAnswerText: "vrai",
      explanation: "2×6 - 4×3 = 12 - 12 = 0, le déterminant est nul donc les vecteurs sont colinéaires.",
      method: "Deux vecteurs (x;y) et (x';y') sont colinéaires si et seulement si xy' - yx' = 0.",
      commonMistake: "Comparer seulement les abscisses ou les ordonnées sans calculer le déterminant.",
      estimatedTimeSeconds: 60,
    },
    {
      chapter: "Géométrie",
      notion: "Distance entre deux points",
      competency: "Calculer la distance entre deux points dans le plan",
      difficulty: "NIVEAU_1_FONDAMENTAL",
      frequencyTier: "TRES_FREQUENTE",
      type: "QCM",
      prompt: "Quelle est la distance entre les points A(1 ; 1) et B(4 ; 5) ?",
      choices: ["3", "4", "5", "7"],
      correctIndex: 2,
      explanation: "AB = √((4-1)² + (5-1)²) = √(9+16) = √25 = 5.",
      method: "Utiliser la formule AB = √((x_B-x_A)² + (y_B-y_A)²).",
      commonMistake: "Additionner les différences au lieu de les élever au carré avant la racine.",
      estimatedTimeSeconds: 60,
    },
    {
      chapter: "Géométrie",
      notion: "Produit scalaire",
      competency: "Utiliser le produit scalaire pour caractériser l'orthogonalité",
      difficulty: "NIVEAU_2_APPLICATION",
      frequencyTier: "FREQUENTE",
      type: "VRAI_FAUX",
      prompt: "Si le produit scalaire de deux vecteurs non nuls est égal à 0, alors ces vecteurs sont orthogonaux.",
      correctAnswerText: "vrai",
      explanation: "C'est la définition même : u·v = 0 (avec u et v non nuls) équivaut à u ⊥ v.",
      method: "Rappeler la caractérisation de l'orthogonalité par le produit scalaire nul.",
      commonMistake: "Confondre produit scalaire nul avec vecteurs colinéaires.",
      estimatedTimeSeconds: 45,
    },
    {
      chapter: "Géométrie",
      notion: "Coordonnées du milieu",
      competency: "Calculer les coordonnées du milieu d'un segment",
      difficulty: "NIVEAU_1_FONDAMENTAL",
      frequencyTier: "TRES_FREQUENTE",
      type: "REPONSE_COURTE",
      prompt: "Soit A(2 ; 6) et B(8 ; 2). Quelle est l'abscisse du milieu I de [AB] ?",
      correctAnswerText: "5",
      explanation: "x_I = (x_A + x_B)/2 = (2+8)/2 = 5.",
      method: "Utiliser la formule des coordonnées du milieu : x_I = (x_A+x_B)/2 et y_I = (y_A+y_B)/2.",
      commonMistake: "Oublier de diviser par 2 après avoir additionné les abscisses.",
      estimatedTimeSeconds: 45,
    },
    {
      chapter: "Géométrie",
      notion: "Équation d'un cercle",
      competency: "Reconnaître ou établir l'équation d'un cercle",
      difficulty: "NIVEAU_3_RAISONNEMENT",
      frequencyTier: "OCCASIONNELLE",
      type: "QCM",
      prompt: "Quel est le rayon du cercle d'équation (x-1)² + (y+2)² = 9 ?",
      choices: ["3", "9", "1", "-2"],
      correctIndex: 0,
      explanation: "L'équation est de la forme (x-a)²+(y-b)²=r², ici r² = 9 donc r = 3.",
      method: "Identifier l'équation réduite du cercle (x-a)²+(y-b)²=r² de centre (a;b) et de rayon r.",
      commonMistake: "Prendre directement 9 comme rayon au lieu d'en extraire la racine carrée.",
      estimatedTimeSeconds: 60,
    },
  ];

  for (const q of draftQuestions) {
    await prisma.question.create({
      data: {
        seriesId: series.get("D")!,
        subjectId: mathSubjectId,
        chapterId: chapters.get(q.chapter)!,
        notion: q.notion,
        competency: q.competency,
        type: q.type,
        difficulty: q.difficulty,
        frequencyTier: q.frequencyTier,
        prompt: q.prompt,
        explanation: q.explanation,
        method: q.method,
        commonMistake: q.commonMistake,
        estimatedTimeSeconds: q.estimatedTimeSeconds,
        source: DEMO_SOURCE,
        sourceStatus: "SECONDAIRE",
        published: false,
        validationStatus: "EN_ATTENTE_VALIDATION",
        correctAnswerText: q.type === "QCM" ? null : q.correctAnswerText,
        choices:
          q.type === "QCM"
            ? {
                create: q.choices.map((label, index) => ({
                  label,
                  isCorrect: index === q.correctIndex,
                  order: index,
                })),
              }
            : undefined,
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

  await prisma.questionBankSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
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
