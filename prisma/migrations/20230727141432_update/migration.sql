/*
  Warnings:

  - A unique constraint covering the columns `[folderName]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Submission_folderName_key" ON "Submission"("folderName");
