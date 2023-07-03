import { Prisma } from '@prisma/client';
import csvParser from 'csv-parser';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import multer from 'multer';
import { prisma } from '../config/prisma-connection';
import { generateLecturerIdNumber } from '../utilities/id-utility';
import { sendAccountInvite } from '../utilities/nodemailer-utility';
import { autoGeneratePassword, hashPassword } from '../utilities/password-utility';
import { validateCSVFields } from '../validators/csv-fields-validator';

const router = express.Router();
const upload = multer({ dest: './uploads' });

router.post(
  '/bulk-lecturers',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileSizeInBytes = fs.statSync(req.file.path).size;
    if (fileSizeInBytes === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Empty file uploaded' });
    }

    if (req.file.mimetype !== 'text/csv') {
      return res.status(400).json({ error: 'Invalid file format' });
    }

    const filePath = req.file.path;
    const csvRows = [];

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
          const generatedPassword = autoGeneratePassword
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
                  message: `Failed to ${
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

        fs.unlink(filePath, (error) => {
          if (error) {
            return next(error);
          }

          return res.status(207).json({ responses });
        });
      });
  }
);

export default router;
