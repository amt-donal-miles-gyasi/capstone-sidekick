/*
  Warnings:

  - A unique constraint covering the columns `[userId,email]` on the table `Lecturer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Lecturer" DROP CONSTRAINT "Lecturer_userId_email_firstName_lastName_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_email_firstName_lastName_fkey";

-- DropIndex
DROP INDEX "Lecturer_userId_email_firstName_lastName_key";

-- DropIndex
DROP INDEX "Student_userId_email_firstName_lastName_key";

-- DropIndex
DROP INDEX "User_id_email_firstName_lastName_key";

-- AlterTable
ALTER TABLE "Assignment" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_userId_email_key" ON "Lecturer"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_email_key" ON "Student"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_key" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_email_fkey" FOREIGN KEY ("userId", "email") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecturer" ADD CONSTRAINT "Lecturer_userId_email_fkey" FOREIGN KEY ("userId", "email") REFERENCES "User"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
