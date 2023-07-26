import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { getProfile } from '../utilities/getProfile';

export const lecturerSubmissions = async (req: Request, res: Response) => {
  const { id } = await getProfile(req, res);
  try {
    const StudentSubmissions = await getLecturerAssignmentsWithSubmissions(id);
    return res.status(200).json({
      status: 'success',
      data: {
        StudentSubmissions,
      },
    });
  } catch (error) {
    throw new error();
  }
};

async function getLecturerAssignmentsWithSubmissions(lecturerId) {
  try {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: lecturerId },
      include: {
        Assignment: {
          include: {
            submissions: {
              include: {
                student: true,
              },
            },
          },
        },
      },
    });

    return lecturer;
  } catch (error) {
    throw new error();
  }
}
