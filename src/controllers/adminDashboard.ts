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
    res.status(500).json({
      success: false,
      error: error,
    });
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
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    const totalStudents = students.length;
    res.status(200).json({
      students: students,
      totalStudents: totalStudents,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getAllAss = async (req: Request, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany();
    const totalAssignments: number = assignments.length;
    res.status(200).json({
      assignments: assignments,
      totalAssignments: totalAssignments,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

export const getAllSubmissions = async (req: Request, res: Response) => {
  try {
    const submissions = await prisma.submissions.findMany();
    const totalSubmissions = submissions.length;

    res.status(200).json({
      submissions: totalSubmissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};
