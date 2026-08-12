-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'ETABLISSEMENT', 'UTILISATEUR');

-- CreateEnum
CREATE TYPE "EstablishmentType" AS ENUM ('COLLEGE_LYCEE', 'UNIVERSITE', 'GRANDE_ECOLE', 'CENTRE_FORMATION');

-- CreateEnum
CREATE TYPE "PublicOrPrivate" AS ENUM ('PUBLIC', 'PRIVE');

-- CreateEnum
CREATE TYPE "EstablishmentPlan" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "EstablishmentStatus" AS ENUM ('PENDING_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('QCM', 'QCM_MULTIPLE', 'VRAI_FAUX', 'REPONSE_COURTE');

-- CreateEnum
CREATE TYPE "QuestionDifficulty" AS ENUM ('FACILE', 'MOYEN', 'DIFFICILE');

-- CreateEnum
CREATE TYPE "SimulationMode" AS ENUM ('ENTRAINEMENT', 'EXAMEN');

-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('EN_COURS', 'TERMINEE', 'ABANDONNEE');

-- CreateEnum
CREATE TYPE "BadgeCriteriaType" AS ENUM ('FIRST_SIMULATION', 'SIMULATIONS_COUNT', 'QUESTIONS_ANSWERED', 'AVERAGE_SCORE');

-- CreateEnum
CREATE TYPE "ResourceCategoryKind" AS ENUM ('NIVEAU', 'DOMAINE', 'FILIERE');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('COURS', 'FICHE_REVISION', 'ANNALE', 'EXERCICE', 'CORRIGE', 'MEMOIRE', 'GUIDE', 'LIVRE_NUMERIQUE', 'SUPPORT_PEDAGOGIQUE');

-- CreateEnum
CREATE TYPE "ResourceFormat" AS ENUM ('PDF', 'IMAGE', 'DOCUMENT', 'VIDEO', 'AUDIO', 'INTERACTIF');

-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('BROUILLON', 'EN_ATTENTE', 'VALIDE', 'PUBLIE', 'ARCHIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "dateNaissance" TIMESTAMP(3),
    "niveau" TEXT,
    "classeOuNiveauUniv" TEXT,
    "serie" TEXT,
    "ville" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'UTILISATEUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EstablishmentType" NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "publicOrPrivate" "PublicOrPrivate",
    "filieres" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "niveauAdmission" TEXT,
    "admissionInfo" TEXT,
    "budgetRange" TEXT,
    "isPartner" BOOLEAN NOT NULL DEFAULT false,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "websiteUrl" TEXT,
    "plan" "EstablishmentPlan" NOT NULL DEFAULT 'FREE',
    "planExpiresAt" TIMESTAMP(3),
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "status" "EstablishmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "ownerUserId" TEXT,
    "responsableNom" TEXT,
    "responsableEmail" TEXT,
    "responsablePhone" TEXT,
    "justificatifUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "claimInviteEmail" TEXT,
    "claimToken" TEXT,
    "claimedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "userId" TEXT NOT NULL,
    "establishmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("userId","establishmentId")
);

-- CreateTable
CREATE TABLE "brochure_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "establishmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brochure_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_series" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'GA',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bac_series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bac_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_series_subjects" (
    "seriesId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "bac_series_subjects_pkey" PRIMARY KEY ("seriesId","subjectId")
);

-- CreateTable
CREATE TABLE "bac_chapters" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bac_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_questions" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL DEFAULT 'QCM',
    "difficulty" "QuestionDifficulty" NOT NULL DEFAULT 'MOYEN',
    "prompt" TEXT NOT NULL,
    "explanation" TEXT,
    "source" TEXT,
    "examYear" INTEGER,
    "correctAnswerText" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bac_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_question_choices" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "bac_question_choices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_simulations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "mode" "SimulationMode" NOT NULL,
    "status" "SimulationStatus" NOT NULL DEFAULT 'EN_COURS',
    "chapterIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requestedQuestionCount" INTEGER NOT NULL,
    "durationSeconds" INTEGER,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "timeSpentSeconds" INTEGER,
    "score" DOUBLE PRECISION,
    "correctCount" INTEGER,
    "incorrectCount" INTEGER,
    "unansweredCount" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bac_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_simulation_answers" (
    "id" TEXT NOT NULL,
    "simulationId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedChoiceIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "answerText" TEXT,
    "isCorrect" BOOLEAN,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "bac_simulation_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_badges" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "criteriaType" "BadgeCriteriaType" NOT NULL,
    "threshold" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bac_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bac_user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bac_user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "ResourceCategoryKind" NOT NULL,
    "parentId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resource_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "author" TEXT,
    "type" "ResourceType" NOT NULL,
    "format" "ResourceFormat" NOT NULL DEFAULT 'PDF',
    "fileUrl" TEXT,
    "coverImageUrl" TEXT,
    "fileSizeBytes" INTEGER,
    "categoryId" TEXT,
    "niveauId" TEXT,
    "domaineId" TEXT,
    "filiereId" TEXT,
    "subjectId" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "priceLabel" TEXT,
    "status" "ResourceStatus" NOT NULL DEFAULT 'BROUILLON',
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_views" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_downloads" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "userId" TEXT,
    "downloadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resource_downloads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "establishments_claimToken_key" ON "establishments"("claimToken");

-- CreateIndex
CREATE UNIQUE INDEX "bac_series_country_code_key" ON "bac_series"("country", "code");

-- CreateIndex
CREATE UNIQUE INDEX "bac_subjects_slug_key" ON "bac_subjects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bac_chapters_subjectId_name_key" ON "bac_chapters"("subjectId", "name");

-- CreateIndex
CREATE INDEX "bac_questions_seriesId_subjectId_chapterId_idx" ON "bac_questions"("seriesId", "subjectId", "chapterId");

-- CreateIndex
CREATE INDEX "bac_questions_published_idx" ON "bac_questions"("published");

-- CreateIndex
CREATE INDEX "bac_simulations_userId_createdAt_idx" ON "bac_simulations"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "bac_simulation_answers_simulationId_questionId_key" ON "bac_simulation_answers"("simulationId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "bac_badges_code_key" ON "bac_badges"("code");

-- CreateIndex
CREATE UNIQUE INDEX "bac_user_badges_userId_badgeId_key" ON "bac_user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "resource_categories_slug_key" ON "resource_categories"("slug");

-- CreateIndex
CREATE INDEX "resource_categories_parentId_idx" ON "resource_categories"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "resource_subjects_slug_key" ON "resource_subjects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "resources_slug_key" ON "resources"("slug");

-- CreateIndex
CREATE INDEX "resources_status_categoryId_idx" ON "resources"("status", "categoryId");

-- CreateIndex
CREATE INDEX "resources_niveauId_domaineId_filiereId_idx" ON "resources"("niveauId", "domaineId", "filiereId");

-- CreateIndex
CREATE INDEX "resources_type_isPremium_idx" ON "resources"("type", "isPremium");

-- CreateIndex
CREATE INDEX "resource_views_resourceId_viewedAt_idx" ON "resource_views"("resourceId", "viewedAt");

-- CreateIndex
CREATE INDEX "resource_downloads_resourceId_downloadedAt_idx" ON "resource_downloads"("resourceId", "downloadedAt");

-- AddForeignKey
ALTER TABLE "establishments" ADD CONSTRAINT "establishments_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishments" ADD CONSTRAINT "establishments_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brochure_requests" ADD CONSTRAINT "brochure_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brochure_requests" ADD CONSTRAINT "brochure_requests_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_series_subjects" ADD CONSTRAINT "bac_series_subjects_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "bac_series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_series_subjects" ADD CONSTRAINT "bac_series_subjects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "bac_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_chapters" ADD CONSTRAINT "bac_chapters_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "bac_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_questions" ADD CONSTRAINT "bac_questions_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "bac_series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_questions" ADD CONSTRAINT "bac_questions_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "bac_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_questions" ADD CONSTRAINT "bac_questions_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "bac_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_questions" ADD CONSTRAINT "bac_questions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_question_choices" ADD CONSTRAINT "bac_question_choices_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "bac_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_simulations" ADD CONSTRAINT "bac_simulations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_simulations" ADD CONSTRAINT "bac_simulations_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "bac_series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_simulations" ADD CONSTRAINT "bac_simulations_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "bac_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_simulation_answers" ADD CONSTRAINT "bac_simulation_answers_simulationId_fkey" FOREIGN KEY ("simulationId") REFERENCES "bac_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_simulation_answers" ADD CONSTRAINT "bac_simulation_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "bac_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_user_badges" ADD CONSTRAINT "bac_user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bac_user_badges" ADD CONSTRAINT "bac_user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "bac_badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_categories" ADD CONSTRAINT "resource_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "resource_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "resource_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "resource_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_domaineId_fkey" FOREIGN KEY ("domaineId") REFERENCES "resource_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_filiereId_fkey" FOREIGN KEY ("filiereId") REFERENCES "resource_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "resource_subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_views" ADD CONSTRAINT "resource_views_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_views" ADD CONSTRAINT "resource_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_downloads" ADD CONSTRAINT "resource_downloads_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "resources"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resource_downloads" ADD CONSTRAINT "resource_downloads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
