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
    const assignment = await getAssignmentId(assignmentUniqueCode);

    const submission = await prisma.submissions.create({
      data: {
        studentId,
        assignmentId: assignment.id,
        locations: texts,
        lecturerId: assignment.lecturerId,
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

export const saveToDb = async (
  assignmentId,
  studentId,
  folderName,
  locations,
  slug
) => {
  try {
    const assignment = await getAssignmentId(assignmentId);

    const submission = await prisma.submission.create({
      data: {
        assignment: { connect: { id: assignment.id } },
        student: { connect: { id: studentId } },
        folderName,
        lecturer: { connect: { id: assignment.lecturerId } },
        snapshots: { create: { s3Key: locations, snapshotName: slug } },
      },
      include: {
        snapshots: true,
      },
    });

    return submission;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
