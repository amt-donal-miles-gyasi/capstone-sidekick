import { prisma } from "../config/prisma-connection";


export const generateStudentIdNumber = async (): Promise<number> => {

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

export const generateLecturerIdNumber = async (): Promise<number> => {

  const latestLecturer = await prisma.lecturer.findFirst({
    orderBy: {
      lecturerId: 'desc',
    },
  });

  let lastId = 'LEC-00000'
  if (latestLecturer) {
    lastId = latestLecturer.lecturerId
  }

  const nextStaffIdNumber = lastId
    ? parseInt(lastId.split('-')[1]) + 1
    : 1;
  const paddedStaffIdNumber = nextStaffIdNumber.toString().padStart(5, '0');

  return +paddedStaffIdNumber;
};


