import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { getProfile } from '../utilities/getProfile';

// return student submissions for the student page

export const getStudentSubmissions = async (req: Request, res: Response) => {
  //   const user = req.user;
  const profile = await getProfile(req, res);
  const submissions = await getStudentAssignmentsWithSubmissions(profile.id);
  // const id = submissions[0].assignmentId;
  // const { title, description, deadline } = await assignmentsInfo(id);

  res.json({
    submissionsDetails: submissions,
    id: profile.id,
  });
};

async function getStudentAssignmentsWithSubmissions(studentId) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        submissions: {
          include: {
            assignment: true,
          },
        },
      },
    });
    return student;
  } catch (error) {
    throw new error();
  }
}

// const assignmentsInfo = async (assignmentId) => {
//   try {
//     const assignment = await prisma.assignment.findUnique({
//       where: {
//         id: assignmentId,
//       },
//     });

//     return assignment;
//   } catch (error) {
//     throw new error();
//   }
// };
