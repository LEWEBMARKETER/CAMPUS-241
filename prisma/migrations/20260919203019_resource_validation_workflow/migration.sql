-- AlterTable
ALTER TABLE "resources" ADD COLUMN     "rejectionNote" TEXT,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
ADD COLUMN     "validatedById" TEXT;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
