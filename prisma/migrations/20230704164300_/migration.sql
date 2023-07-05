/*
  Warnings:

  - You are about to drop the `_AssignmentToStudent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AssignmentToStudent" DROP CONSTRAINT "_AssignmentToStudent_A_fkey";

-- DropForeignKey
ALTER TABLE "_AssignmentToStudent" DROP CONSTRAINT "_AssignmentToStudent_B_fkey";

-- DropTable
DROP TABLE "_AssignmentToStudent";
