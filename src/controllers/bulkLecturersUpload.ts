import { Prisma } from '@prisma/client';
import csvParser from 'csv-parser';
import { Request, Response } from 'express';
import fs from 'fs';
import { prisma } from '../config/prisma-connection';
import { generateLecturerIdNumber } from '../utilities/id-utility';
import { sendAccountInvite } from '../utilities/nodemailer-utility';
import {
    autoGeneratePassword,
    hashPassword,
} from '../utilities/password-utility';
import { validateCSVFields } from '../validators/csv-fields-validator';
import { deleteFile, validateCSVFile } from '../utilities/file-handler';
import { logger } from '../utilities/logger';

/**
 * Handles the upload of bulk lecturers from a CSV file.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the bulk upload is completed.
 */

export const uploadBulkLecturers = async (
  req: Request,
  res: Response): Promise<void> => {
  const filePath = req.file.path;
  const csvRows = [];
  await validateCSVFile(req, res);

  fs.createReadStream(filePath, { encoding: 'utf-8' })
    .pipe(csvParser())
    .on('data', async (row) => {
      const fields = Object.keys(row);
      if (!validateCSVFields(fields)) {
        return res.status(400).json({ error: 'Invalid CSV fields' });
      }
      csvRows.push(row);
    })
    .on('end', async () => {
      const nextIdNumber = await generateLecturerIdNumber();
      const responses = [];

      for (const [index, row] of csvRows.entries()) {
        const { firstName, lastName } = row;
        const email = row.email.toLowerCase();
        const lecturerId = `LEC-${(nextIdNumber + index)
          .toString()
          .padStart(5, '0')}`;
        const generatedPassword = autoGeneratePassword;
        const password = await hashPassword(generatedPassword);
        const role = 'LECTURER';

        try {
          await prisma.user.create({
            data: {
              email,
              password,
              loginId: lecturerId,
              role,
              lecturer: {
                create: {
                  firstName,
                  lastName,
                  lecturerId,
                },
              },
            },
          });

          const jurisdiction = role.toLowerCase();
          const name = `${firstName} ${lastName}`;

          await sendAccountInvite(
            name,
            email,
            password,
            jurisdiction,
            lecturerId
          );

          responses.push({
            status: 200,
            message: `Successfully added ${
              firstName + ' ' + lastName
            } to lecturers.`,
          });
        } catch (error) {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
              // Unique constraint violation
              responses.push({
                status: 400,
                message: `Failed to add ${
                  firstName + ' ' + lastName
                }. Lecturer had a duplicate email: ${email}`,
              });
            } else if (error.code === 'P2003') {
              // Foreign key constraint violation
              return res
                .status(400)
                .json({ error: 'Invalid reference detected' });
            }
          }
        }
      }

      await deleteFile(filePath)
        .then(() => {
          return res.status(207).json({ responses });
        })
        .catch(() => {
          logger.error(`Error deleting file: ${filePath}`);
        });
    });
};
