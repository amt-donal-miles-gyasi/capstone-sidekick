/*
  Warnings:

  - A unique constraint covering the columns `[uniqueCode]` on the table `Assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniqueCode` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "uniqueCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Assignment_uniqueCode_key" ON "Assignment"("uniqueCode");
