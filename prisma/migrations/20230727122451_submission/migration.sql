/*
  Warnings:

  - You are about to drop the `submissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_assignmentId_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_lecturerId_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_studentId_fkey";

-- DropTable
DROP TABLE "submissions";
