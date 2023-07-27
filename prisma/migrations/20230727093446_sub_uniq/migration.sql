/*
  Warnings:

  - A unique constraint covering the columns `[studentId,assignmentId,snaps]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[assignmentId,snaps]` on the table `submissions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "submissions_snaps_key";

-- CreateIndex
CREATE UNIQUE INDEX "submissions_studentId_assignmentId_snaps_key" ON "submissions"("studentId", "assignmentId", "snaps");

-- CreateIndex
CREATE UNIQUE INDEX "submissions_assignmentId_snaps_key" ON "submissions"("assignmentId", "snaps");
