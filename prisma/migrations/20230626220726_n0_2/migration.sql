/*
  Warnings:

  - A unique constraint covering the columns `[loginID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `loginID` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginID" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_loginID_key" ON "User"("loginID");
