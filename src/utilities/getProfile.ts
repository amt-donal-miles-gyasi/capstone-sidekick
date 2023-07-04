import { Lecturer, Role, Student, User } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';

/**
 * Retrieves the profile information of the authenticated user.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Lecturer | Student | User>} The profile information of the user.
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<Lecturer | Student | User> => {
  const role = (req.user as User).role;
  const id = (req.user as User).id;
  let user: Lecturer | Student | User;

  if (role === Role.ADMIN) {
    user = await prisma.user.findFirst({
      where: { id: id },
    });
    return user;
  }

  role === Role.LECTURER
    ? (user = await prisma.lecturer.findFirst({
        where: { userId: id },
      }))
    : (user = await prisma.student.findFirst({
        where: { userId: id },
      }));

  if (!user) res.status(404);

  return user;
};
