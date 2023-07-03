import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { generateStudentIdNumber } from '../utilities/id-utility';
import {
  hashPassword,
  autoGeneratePassword,
} from '../utilities/password-utility';
import { sendAccountInvite } from '../utilities/nodemailer-utility';

// funtion to generate lecture information from request body
export const adminGenerateStundent = async (req: Request, res: Response) => {
  const firstName: string = req.body.firstName;
  const lastName: string = req.body.lastName;
  const email: string = req.body.email;
  const name = `${firstName} ${lastName}`;
  const genPassword = autoGeneratePassword; // autoGenerated password
  const generateID = await generateStudentIdNumber();
  const studentId = `STU- ${generateID.toString().padStart(5, '0')}`;
  try {
    const password = await hashPassword(genPassword);

    const newStu = await prisma.user.create({
      data: {
        email: email,
        password,
        loginId: studentId,
        role: 'STUDENT',
        student: {
          create: {
            firstName,
            lastName,
            studentId: studentId,
          },
        },
      },
      include: {
        student: true,
      },
    });
    await sendAccountInvite(name, email, genPassword, 'STUDENT', studentId);
    return res.json({
      success: true,
      message: 'Student created successfully',
      data: newStu,
    });
  } catch (error: unknown) {
    res.status(500).json({
      error: error,
    });
  }
};
