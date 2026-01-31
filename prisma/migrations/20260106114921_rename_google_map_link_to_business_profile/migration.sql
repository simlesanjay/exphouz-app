/*
  Warnings:

  - You are about to drop the column `googleMapLink` on the `professional_profiles` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "AuthProvider" ADD VALUE 'LINKEDIN';

-- DropForeignKey
ALTER TABLE "professional_services" DROP CONSTRAINT "professional_services_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_professionalId_fkey";

-- DropForeignKey
ALTER TABLE "requirement_responses" DROP CONSTRAINT "requirement_responses_professionalId_fkey";

-- AlterTable
ALTER TABLE "professional_profiles" DROP COLUMN "googleMapLink",
ADD COLUMN     "googleBusinessProfile" TEXT;

-- AddForeignKey
ALTER TABLE "professional_services" ADD CONSTRAINT "professional_services_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professional_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professional_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requirement_responses" ADD CONSTRAINT "requirement_responses_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "professional_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
