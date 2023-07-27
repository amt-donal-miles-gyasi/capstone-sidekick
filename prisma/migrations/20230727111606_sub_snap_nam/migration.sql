/*
  Warnings:

  - The `s3Key` column on the `Snapshot` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "s3Key",
ADD COLUMN     "s3Key" TEXT[];
