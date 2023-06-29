/*
  Warnings:

  - You are about to drop the column `lecturerId` on the `Assignment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Lecturer` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,email]` on the table `Lecturer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lecturerId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Assignment" DROP CONSTRAINT "Assignment_lecturerId_fkey";

-- DropForeignKey
ALTER TABLE "Lecturer" DROP CONSTRAINT "Lecturer_userId_email_firstName_lastName_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_email_firstName_lastName_fkey";

-- DropIndex
DROP INDEX "Lecturer_userId_email_firstName_lastName_key";

-- DropIndex
DROP INDEX "Student_userId_email_firstName_lastName_key";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_id_email_firstName_lastName_key";

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "lecturerId";

-- AlterTable
ALTER TABLE "Lecturer" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "lecturerId" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_id_email_key" ON "Lecturer"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_id_email_key" ON "Student"("id", "email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_studentId_email_fkey" FOREIGN KEY ("studentId", "email") REFERENCES "Student"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_lecturerId_email_fkey" FOREIGN KEY ("lecturerId", "email") REFERENCES "Lecturer"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;
