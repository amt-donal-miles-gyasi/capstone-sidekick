import { prisma } from '../config/prisma-connection';
import { Request, Response } from 'express';
import { CustomRequest } from '../middlewares/studentChecker';

export const checkUser = async (req: Request, res: Response) => {
  const { loginId } = req.body;

  try {
    const findStudent = await prisma.student.findFirst({
      where: { studentId: loginId },
    });

    if (findStudent) {
      const { email, firstName, lastName } = findStudent;

      res.status(200).json({
        success: true,
        data: {
          email,
          name: `${firstName} ${lastName}`,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        msg: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const checkAss = async (req: CustomRequest, res: Response) => {
  const { loginId, uniqueCode } = req.info;
  try {
    const id = await prisma.student.findFirst({
      where: {
        studentId: loginId,
      },
    });
    const studentId = id.id;
    const studName = id.studentId;

    const getAssignmentDetails = await prisma.assignment.findFirst({
      where: {
        uniqueCode,
      },
    });
    const { deadline, title, description } = getAssignmentDetails;
    const assignmentId = getAssignmentDetails.id;

    const result = await prisma.studentsOnAsignment.findFirst({
      where: {
        assignmentId,
        studentId,
      },
    });

    if (result) {
      res.status(200).json({
        success: true,
        result: result,
        msg: `student ${studName} is assigned to the assignment`,
        data: {
          deadline: deadline,
          title: title,
          description: description,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        msg: `student ${studName} is not assigned to the assignment`,
      });
    }
  } catch (error) {
    res.status(error.status).json({ success: false, error: error.message });
  }
};
