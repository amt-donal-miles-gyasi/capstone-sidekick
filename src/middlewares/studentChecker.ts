import { prisma } from '../config/prisma-connection';
import { Request, Response, NextFunction } from 'express';

export interface CustomRequest extends Request {
  info: {
    loginId: string;
    uniqueCode: string;
  };
}

export const midCheckUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const studentId: string = req.body.loginId;
  // const uniqueId:  string = req.body.uniqueCode

  try {
    const findStudent = await prisma.student.findFirst({
      where: {
        studentId,
      },
    });
    if (findStudent !== null) {
      req.info = {
        loginId: findStudent.studentId,
        uniqueCode: req.body.uniqueCode,
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
  const uniqueCode = req.body.uniqueCode;
  try {
    const findAssignment = await prisma.assignment.findFirst({
      where: {
        uniqueCode,
      },
    });
    if (findAssignment !== null) {
      req.info = {
        loginId: req.body.loginId,
        uniqueCode: req.body.uniqueCode,
      };
      return next();
    } else {
      res.status(404).json({
        success: false,
        msg: 'assignment not found',
      });
    }
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
