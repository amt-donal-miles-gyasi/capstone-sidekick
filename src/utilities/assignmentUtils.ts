import { prisma } from '../config/prisma-connection';
import { sendAssignmentConfimation } from './nodemailer-utility';

export const getStudentId = async (studentId) => {
  const student = await prisma.student.findUnique({
    where: { studentId },
  });

  return student.id;
};

export const getAssignmentId = async (assignmentId) => {
  const assignment = await prisma.assignment.findUnique({
    where: { uniqueCode: assignmentId },
  });

  return assignment;
};

export const saveSubmissions = async (
  studentId,
  assignmentId,
  texts: string[],
  snap,
  folderName
) => {
  try {
    const studentTableId = await getStudentId(studentId);
    const { id, lecturerId } = await getAssignmentId(assignmentId);

    const submission = await prisma.submissions.create({
      data: {
        studentId: studentTableId,
        assignmentId: id,
        locations: texts,
        lecturerId,
        snaps: snap,
        folderName: folderName,
      },
    });
    return submission;
  } catch (error) {
    throw new Error('Error uploading file to database: ' + error.message);
  }
};

export const sendStudentMail = async (studentId, assignmentId) => {
  const student = await prisma.student.findUnique({
    where: {
      studentId,
    },
  });

  const assignment = await prisma.assignment.findUnique({
    where: {
      uniqueCode: assignmentId,
    },
  });

  const name = `${student.firstName} ${student.lastName}`;

  await sendAssignmentConfimation(name, student.email, assignment.title);
};
