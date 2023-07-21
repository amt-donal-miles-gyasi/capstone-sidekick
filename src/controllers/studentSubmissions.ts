import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { getProfile } from '../utilities/getProfile';

export const getStudentSubmissions = async (req: Request, res: Response) => {
  //   const user = req.user;
  const profile = await getProfile(req, res);
  const submissions = getStudentAssignmentsWithSubmissions(profile.id);

  res.json({ submissions: submissions, id: profile.id });
};

async function getStudentAssignmentsWithSubmissions(studentId) {
  try {
    const student = await prisma.student.findUnique({
      where: { uniqueCode: studentId },
      include: {
        submissions: {
          include: {
            student: true,
          },
        },
      },
    });

    return student;
  } catch (error) {
    throw new error();
  }
}
