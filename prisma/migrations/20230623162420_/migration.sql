/*
  Warnings:

  - You are about to drop the column `lecturerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,email]` on the table `Lecturer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_lecturerId_email_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_studentId_email_fkey";

-- DropIndex
DROP INDEX "Lecturer_id_email_key";

-- DropIndex
DROP INDEX "Student_id_email_key";

-- AlterTable
ALTER TABLE "Lecturer" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lecturerId",
DROP COLUMN "studentId";

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_userId_email_key" ON "Lecturer"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_email_key" ON "Student"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_email_fkey" FOREIGN KEY ("userId", "email") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecturer" ADD CONSTRAINT "Lecturer_userId_email_fkey" FOREIGN KEY ("userId", "email") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
