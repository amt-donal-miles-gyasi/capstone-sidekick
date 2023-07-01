import { prisma } from '../config/prisma-connection';

export const generateId = (latestId: string): string => {
  //const prefix = latestId.split('-')[0];
  const nextStaffIdNumber = parseInt(latestId.split('-')[1]) + 1;
  const paddedStaffIdNumber = nextStaffIdNumber.toString().padStart(5, '0');
  //const staffId = `${prefix}-${paddedStaffIdNumber}`;

  return paddedStaffIdNumber;
};

export const findLastStudentId = async () => {
  const latestStudent = await prisma.student.findFirst({
    orderBy: {
      studentId: 'desc',
    },
  });

  let lastId = 'STU-00000';
  if (latestStudent) {
    lastId = latestStudent.studentId;
  }

  return lastId;
};

export const findLastLecturerId = async (): Promise<string> => {
  const latestStudent = await prisma.student.findFirst({
    orderBy: {
      studentId: 'desc',
    },
  });

  let lastId = 'STU-00000';
  if (latestStudent) {
    lastId = latestStudent.studentId;
  }

  return lastId;
};
