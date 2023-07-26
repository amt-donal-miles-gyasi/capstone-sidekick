import { prisma } from '../config/prisma-connection';
import { sendAssignmentConfimation } from './nodemailer-utility';

export const getStudentId = async (studentId) => {
  try {
    const student = await prisma.student.findUnique({
      where: { studentId },
    });
    //   console.log(student.id);
    return student.id;
  } catch (error) {
    throw new Error(`${error}`);
  }
};

export const getAssignmentId = async (assignmentId) => {
  //   console.log(assignmentId);
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { uniqueCode: assignmentId },
    });
    return assignment;
  } catch (error) {
    throw new Error(`${error}`);
  }

  //   console.log(assignment);
};

export const saveSubmissions = async (
  studentId,
  assignmentUniqueCode,
  texts: string[],
  snap,
  folderName
) => {
  try {
    //const studentTableId = await getStudentId(studentId);
    const assign = await getAssignmentId(assignmentUniqueCode);

    const submission = await prisma.submissions.create({
      data: {
        studentId,
        assignmentId: assign.id,
        locations: texts,
        lecturerId: assign.lecturerId,
        snaps: [snap],
        folderName: folderName,
      },
    });
    return submission;
  } catch (error) {
    throw new Error('Error uploading file to database: ' + error);
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
