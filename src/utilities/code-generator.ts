// import { customAlphabet } from 'nanoid';
import { prisma } from '../config/prisma-connection';

// const nanoid = customAlphabet('1234567890abcdef', 7);

export async function generateUniqueCode() {
  let uniqueCode: string;
  let isUnique: boolean;

  do {
    // uniqueCode = nanoid();
    uniqueCode = 'gbha255';
    const existingAssignment = await prisma.assignment.findUnique({
      where: { uniqueCode },
    });
    isUnique = !existingAssignment;
  } while (!isUnique);

  return uniqueCode.toUpperCase();
}
