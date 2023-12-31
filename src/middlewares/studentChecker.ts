import { prisma } from '../config/prisma-connection';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  info: {
    student_id: string;
    assignment_code: string;
  };
}

export const midCheckUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const studentId: string = req.body.student_id;
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  if (!studentId) {
    return res
      .status(400)
      .json({ error: 'Missing expected variables in the request body' });
  }

  try {
    const findStudent = await prisma.student.findFirst({
      where: {
        studentId,
      },
    });
    if (findStudent !== null) {
      req.info = {
        student_id: findStudent.studentId,
        assignment_code: req.body.assignment_code,
      };
      return next();
    } else {
      res.status(404).json({
        success: false,
        msg: 'user not found',
      });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const MidwareCheckAss = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { assignment_code, student_id } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: 'Request body is empty' });
  }

  if (!assignment_code || !student_id) {
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

export const checkAss = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { student_id, assignment_code } = req.info;
  try {
    const id = await prisma.student.findFirst({
      where: {
        studentId: student_id,
      },
    });
    const studentId = id.id;
    const studName = id.studentId;

    const getAssignmentDetails = await prisma.assignment.findFirst({
      where: {
        uniqueCode: assignment_code,
      },
    });
    const { deadline } = getAssignmentDetails;
    const assignmentId = getAssignmentDetails.id;
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
        msg: `student ${studName} is not assigned to the assignment`,
      });
    }
  } catch (error) {
    res.status(error.status).json({ status: 'error', error: error.message });
  }
};
