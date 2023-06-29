/*
  Warnings:

  - You are about to drop the column `loginID` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_loginID_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "loginID";
