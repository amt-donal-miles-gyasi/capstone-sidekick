/*
  Warnings:

  - A unique constraint covering the columns `[snapshotName]` on the table `Snapshot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_snapshotName_key" ON "Snapshot"("snapshotName");
