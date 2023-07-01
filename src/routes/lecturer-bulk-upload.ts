import csvParser from 'csv-parser';
import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer from 'multer';
import { prisma } from '../config/prisma-connection';
import { generateIdNumber } from '../utilities/id-utility';
import { sendAccountInvite } from '../utilities/nodemailer-utility';
import { hashPassword } from '../utilities/password-utility';
import { validateCSVFields } from '../validators/csv-fields-validator';
import { Prisma } from '@prisma/client';

const router = express.Router();
const upload = multer({ dest: './uploads' });

router.post(
  '/upload-lecturers',
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
          return next({ error: 'Invalid CSV fields' });
        }
        csvRows.push(row);
      })
      .on('end', async () => {
        const nextIdNumber = await generateIdNumber();

        const feedback = {
          duplicates: '',
          successRate: csvRows.length
        };

        for (const [index, row] of csvRows.entries()) {
          const { firstName, lastName } = row;
          const email = row.email.toLowerCase();
          const lecturerId = `LEC-${(nextIdNumber + index)
            .toString()
            .padStart(5, '0')}`;
          const password = await hashPassword();
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
          } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2002') {
                // Unique constraint violation
                feedback.duplicates += ` ${email},`;
                feedback.successRate--
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
        });

        if (feedback.duplicates !== '') {
          return res.status(200).json({
            message: `${feedback.successRate} lecturer(s) successfully uploaded with ${csvRows.length - feedback.successRate} duplicates: ${feedback.duplicates}`,
          });
        }

        return res.status(200).json({
          message: `Lecturers successfully uploaded.`,
        });
      });
  }
);

export default router;
