import { Request, Response } from 'express';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma-connection';
import generateSequenceNumb from '../utilities/generateSequenceUtil';

const saltRounds: number = parseInt(process.env.BCRYPT_SALT); //parameter needed for bcrypt
const initLectId: string = process.env.INITIAL_USER_NUMB; //intitial number to generate lecturer sequence id

const salt: string = bcrypt.genSaltSync(saltRounds); //generate salt

// funtion to generate lecture information from request body
export const adminGenerateLecturers = async (req: Request, res: Response) => {
  const firstName: string = req.body.firstname;
  const lastName: string = req.body.lastname;
  const email: string = req.body.email;

  try {
    const password: string = generator.generate({
      length: 10,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
    const hashedPassword: string = await bcrypt.hash(password, salt);

    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findUser === null) {
      const lastLect = await prisma.lecturer.findFirst({
        select: {
          lecturerId: true,
        },
        orderBy: {
          lecturerId: 'desc',
        },
        where: {
          lecturerId: {
            startsWith: 'LEC-',
          },
        },
      });
      if (lastLect) {
        const nextLectID: string = generateSequenceNumb(lastLect.lecturerId); //next generated number

        const newLect = await prisma.user.create({
          data: {
            email: email,
            password: hashedPassword,
            loginId: `LEC-${nextLectID}`,
            role: 'LECTURER',
            lecturer: {
              create: {
                firstName,
                lastName,
                lecturerId: `LEC-${nextLectID}`,
              },
            },
          },
          include: {
            lecturer: true,
          },
        });
        return res.json({
          success: true,
          message: 'Lecturer created successfully',
          data: newLect,
        });
      } else {
        const newLect = await prisma.user.create({
          data: {
            email: email,
            password: hashedPassword,
            loginId: `LEC-${initLectId}`,
            role: 'LECTURER',
            lecturer: {
              create: {
                firstName,
                lastName,
                lecturerId: `LEC-${initLectId}`,
              },
            },
          },
          include: {
            lecturer: true,
          },
        });
        return res.json({
          success: true,
          message: 'Lecturer created successfully',
          data: newLect,
        });
      }
    } else {
      return res.status(400).json({
        message: 'User already exists',
      });
    }
  } catch (error: unknown) {
    res.status(500).json({
      error: error,
    });
  }
};
