import { prisma } from '../config/prisma-connection';
import { Request, Response, NextFunction } from 'express';

export const midwareCheckAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { sample_data_object } = req.body;
  const assignment_code = sample_data_object.assignment;
  const student_id = sample_data_object.author;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  if (!sample_data_object) {
    return res
      .status(400)
      .json({ error: 'Missing expected variables in the request body' });
  }

  try {
    const findAssignment = await prisma.assignment.findFirst({
      where: {
        uniqueCode: assignment_code,
      },
    });
    const student = await prisma.student.findUnique({
      where: {
        studentId: student_id,
      },
    });
    const studentId = student.id;

    if (findAssignment === null || student === null) {
      return res
        .status(404)
        .json({ status: 'error', message: 'No assignment or user found' });
    }
    const { deadline } = findAssignment;
    const assignmentId = findAssignment.id;
    const currentDate = new Date(Date.now());

    if (deadline < currentDate) {
      return res
        .status(403)
        .json({ status: 'error', msg: 'submission deadline exceeded' });
    }

    const result = await prisma.studentsOnAsignment.findFirst({
      where: {
        assignmentId,
        studentId,
      },
    });

    if (result) {
      next();
    } else {
      return res.status(404).json({
        status: 'error',
        msg: `student  is not assigned to the assignment`,
      });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
