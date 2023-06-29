/*
  Warnings:

  - A unique constraint covering the columns `[userId,email,firstName,lastName]` on the table `Lecturer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,email,firstName,lastName]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,email,firstName,lastName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Lecturer" DROP CONSTRAINT "Lecturer_userId_email_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_email_fkey";

-- DropIndex
DROP INDEX "Lecturer_userId_email_key";

-- DropIndex
DROP INDEX "Student_userId_email_key";

-- DropIndex
DROP INDEX "User_id_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Lecturer_userId_email_firstName_lastName_key" ON "Lecturer"("userId", "email", "firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_email_firstName_lastName_key" ON "Student"("userId", "email", "firstName", "lastName");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_email_firstName_lastName_key" ON "User"("id", "email", "firstName", "lastName");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_email_firstName_lastName_fkey" FOREIGN KEY ("userId", "email", "firstName", "lastName") REFERENCES "User"("id", "email", "firstName", "lastName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lecturer" ADD CONSTRAINT "Lecturer_userId_email_firstName_lastName_fkey" FOREIGN KEY ("userId", "email", "firstName", "lastName") REFERENCES "User"("id", "email", "firstName", "lastName") ON DELETE RESTRICT ON UPDATE CASCADE;
