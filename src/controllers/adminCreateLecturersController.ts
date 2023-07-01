import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { generateId } from '../utilities/id-utility';
import { hashPassword } from '../utilities/password-utility';

// funtion to generate lecture information from request body
export const adminGenerateLecturers = async (
  req: Request,
  res: Response,
) => {
  const firstName: string = req.body.firstName;
  const lastName: string = req.body.lastName;
  const email: string = req.body.email;

  try {
    //next generated number
    const password = await hashPassword();
    const lecturerCount = await prisma.lecturer.count();
    const lecturerId = generateId('LEC', lecturerCount + 1);
    const newLect = await prisma.user.create({
      data: {
        email: email,
        password,
        loginId: lecturerId,
        role: 'LECTURER',
        lecturer: {
          create: {
            firstName,
            lastName,
            lecturerId: lecturerId,
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
  } catch (error: unknown) {
    res.status(500).json({
      error: error,
    });
  }
};
