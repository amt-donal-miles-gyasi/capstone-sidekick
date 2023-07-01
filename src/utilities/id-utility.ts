import { prisma } from "../config/prisma-connection";

export const generateIdNumber = async (): Promise<number> => {
  const latestStudent = await prisma.student.findFirst({
    orderBy: {
      studentId: 'desc',
    },
  });

  let lastId = 'STU-00000'
  if (latestStudent) {
    lastId = latestStudent.studentId
  }

  const nextStaffIdNumber = lastId
    ? parseInt(lastId.split('-')[1]) + 1
    : 1;
  const paddedStaffIdNumber = nextStaffIdNumber.toString().padStart(5, '0');

  return +paddedStaffIdNumber;
};
