/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Snapshot` table. All the data in the column will be lost.
  - Added the required column `snapshotName` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `folderName` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "updatedAt",
ADD COLUMN     "snapshotName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "folderName" TEXT NOT NULL;
