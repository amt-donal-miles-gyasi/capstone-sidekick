/*
  Warnings:

  - Added the required column `folderName` to the `submissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "folderName" TEXT NOT NULL,
ADD COLUMN     "snaps" TEXT[];
