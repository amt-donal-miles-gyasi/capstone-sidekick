import { Assignment, Role, Status, User } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { generateUniqueCode } from '../utilities/code-generator';
import { getProfile } from '../utilities/getProfile';
import { logger } from '../utilities/logger';
import { sendAssignmentInvite } from '../utilities/nodemailer-utility';

/**
 * Create a new assignment.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - Promise representing the HTTP response.
 */
export const createAssignment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, deadline, description, status, students } = req.body;
  const newDate = new Date(deadline);
  const { id } = await getProfile(req, res);
  const uniqueCode = await generateUniqueCode();
  if (!id) return res.status(401);

  try {
    await prisma.assignment.create({
      data: {
        title,
        description,
        deadline: newDate,
        uniqueCode,
        Lecturer: { connect: { id } },
        students: {
          create:
            students &&
            students.map((studentId: string) => ({
              assignedBy: id,
              students: { connect: { id: studentId } },
            })),
        },
        status,
      },
    });

    if (status === Status.DRAFT) {
      return res
        .status(201)
        .json({ message: 'Assignment saved to draft successfully.' });
    }

    for (const id of students) {
      const student = await prisma.student.findFirst({ where: { id } });
      const { email, firstName, lastName } = student;
      await sendAssignmentInvite(
        `${firstName} ${lastName}`,
        email,
        title,
        deadline,
        uniqueCode
      );
    }

    return res
      .status(201)
      .json({ message: 'Assignment saved & published successfully.' });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: 'Internal server error. here' });
  }
};

/**
 * Get all assignments published by lecturer.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - Promise representing the HTTP response.
 */
export const getAssignments = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = await getProfile(req, res);
  if (!id) return res.status(401);

  try {
    let assignments: Assignment[];

    (req.user as User).role === Role.LECTURER
      ? (assignments = await prisma.assignment.findMany({
          where: { lecturerId: id, status: Status.PUBLISHED },
        }))
      : (assignments = await prisma.assignment.findMany({
          where: {
            status: Status.PUBLISHED,
            students: {
              some: { studentId: id },
            },
          },
          include: { students: true },
        }));

    return res.status(200).json({ assignments });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update an existing assignment using id passed in request parameters.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<Response>} - Promise representing the HTTP response.
 */
export const updateAssignment = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, deadline, description, status } = req.body;
  try {
    await prisma.assignment.update({
      where: { id: req.params.id },
      data: {
        title,
        deadline,
        description,
        status,
      },
    });
    return res.status(200).json({ message: 'Assignment updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
