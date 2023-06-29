import { Request, Response } from 'express';
import generator from 'generate-password';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma-connection';
import generateSequenceNumb from '../utilities/generateSequenceUtil';

const saltRounds: number = parseInt(process.env.BCRYPT_SALT); //parameter needed for bcrypt
const initStuID: string = process.env.INITIAL_USER_NUMB; //intitial number to generate student sequence id

const salt: string = bcrypt.genSaltSync(saltRounds);

// funtion to generate lecture information from request body
export const adminGenerateStundent = async (req: Request, res: Response) => {
  const { email, firstname, lastname } = req.body;
  // res.json({ email: email, firstName: firstname, lastName: lastname });
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
      const lastStu = await prisma.student.findFirst({
        select: {
          studentId: true,
        },
        orderBy: {
          studentId: 'desc',
        },
        where: {
          studentId: {
            startsWith: 'STU-',
          },
        },
      });
      if (lastStu) {
        const nextStuID: string = generateSequenceNumb(lastStu.studentId); //next generated studenID number

        const newStu = await prisma.user.create({
          //creating a new studen
          data: {
            email: email,
            password: hashedPassword,
            loginId: `STU-${nextStuID}`,
            role: 'STUDENT',
            student: {
              create: {
                firstName: firstname,
                lastName: lastname,
                studentId: `STU-${nextStuID}`,
              },
            },
          },
          include: {
            student: true,
          },
        });
        return res.json({
          success: true,
          message: 'Student created successfully',
          data: newStu,
        });
      } else {
        const newStu = await prisma.user.create({
          data: {
            email: email,
            password: hashedPassword,
            loginId: `STU-${initStuID}`,
            role: 'STUDENT',
            student: {
              create: {
                firstName: firstname,
                lastName: lastname,
                studentId: `STU-${initStuID}`,
              },
            },
          },
          include: {
            student: true,
          },
        });
        return res.json({
          success: true,
          message: 'student created successfully',
          data: newStu,
        });
      }
    } else {
      return res.status(400).json({
        message: 'User already exists',
      });
    }
  } catch (error: unknown) {
    res.status(500).json({ error: error });
  }
};
