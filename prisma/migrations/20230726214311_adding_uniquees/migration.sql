/*
  Warnings:

  - A unique constraint covering the columns `[snaps]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "submissions_studentId_assignmentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "submissions_snaps_key" ON "submissions"("snaps");
