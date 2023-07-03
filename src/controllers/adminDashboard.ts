import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const getUsers = await prisma.user.findMany();
    const totaUsers: number = getUsers.length;

    res.status(200).json({
      users: getUsers,
      totaUsers: totaUsers,
    });
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
};

export const getAllLectures = async (req: Request, res: Response) => {
  try {
    const getLecturers = await prisma.lecturer.findMany();
    const totalLectures = getLecturers.length;

    res.status(200).json({
      lecturers: getLecturers,
      totalLectures: totalLectures,
    });
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const getStudents = await prisma.student.findMany();
    const totalStudents = getStudents.length;

    res.status(200).json({
      students: getStudents,
      totalStudents: totalStudents,
    });
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
};

export const getAllAss = async (req: Request, res: Response) => {
  try {
    const assigments = await prisma.assignment.findMany();
    const totalAssignments: number = assigments.length;
    res.status(200).json({
      assigments: assigments,
      totalAssignments: totalAssignments,
    });
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
};
