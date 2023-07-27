import crypto from 'crypto';
import { prisma } from '../config/prisma-connection';

/**
 * Generates a unique code for an assignment.
 * @returns {Promise<string>} The generated unique code.
 */
export async function generateUniqueCode(): Promise<string> {
  let isUnique = false;
  let uniqueCode;

  do {
    uniqueCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    const existingAssignment = await prisma.assignment.findUnique({
      where: { uniqueCode },
    });
    isUnique = !existingAssignment;
  } while (!isUnique);

  return uniqueCode;
}
