import { prisma } from '../config/prisma-connection';
import { Request, Response, NextFunction } from 'express';

export const midwareCheckAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const assignment_code = data.assignment;
  const student_id = data.author;
  const submission_id = data.submission_id;
  const snapshotName = data.snap_content.Slug;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  if (!data) {
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

    if (submission_id) {
      const existingSnapshot = await prisma.snapshot.findFirst({
        where: {
          submissionId: submission_id,
          snapshotName: snapshotName,
        },
      });
      if (existingSnapshot) {
        res
          .status(409)
          .json({ status: 'error', data: 'snapshotName already exists' });
      }
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
    return res.status(500).json({ success: false, error: error.message });
  }
};
