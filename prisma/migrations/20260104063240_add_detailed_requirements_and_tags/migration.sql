-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "tags" TEXT[];

-- AlterTable
ALTER TABLE "requirements" ADD COLUMN     "designStyle" TEXT,
ADD COLUMN     "propertyArea" TEXT,
ADD COLUMN     "propertyType" TEXT;

-- CreateTable
CREATE TABLE "requirement_images" (
    "id" TEXT NOT NULL,
    "requirementId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,

    CONSTRAINT "requirement_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "requirement_images" ADD CONSTRAINT "requirement_images_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
