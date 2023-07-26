import cron from 'node-cron';
import { getNewSubmissions } from '../utilities/get-new-submissions';
import { prisma } from '../config/prisma-connection';
import { sendSubmissionNotice } from '../utilities/nodemailer-utility';
import { Submissions } from '../models/submissions';
import { Lecturer } from '@prisma/client';
import { logger } from '../utilities/logger';

type NewSubmissions = {
  submission: Submissions;
  lecturer: Lecturer;
};

cron.schedule('0 * * * *', async () => {
  const submissions = await getNewSubmissions();

  if (!submissions) return logger.info('No submissions');

  const submissionsByLecturer: { [key: string]: NewSubmissions[] } = {};

  for (const submission of submissions) {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id: submission.assignment.lecturerId },
    });

    const lecturerEmail = lecturer.email;

    if (!submissionsByLecturer[lecturerEmail]) {
      submissionsByLecturer[lecturerEmail] = [];
    }

    const x: NewSubmissions = {
      lecturer,
      submission,
    };

    submissionsByLecturer[lecturerEmail].push(x);
  }

  for (const [lecturerEmail, lecturerSubmissions] of Object.entries(
    submissionsByLecturer
  )) {
    const lecturer = lecturerSubmissions[0].lecturer;

    let emailContent = `
        Dear ${lecturer.firstName},
        <br />
        We would like to invite you to review and evaluate recent assignment submissions made by some of our students.
        <br />
        <br />
      `;

    for (const submission of lecturerSubmissions) {
      const { student, assignment } = submission.submission;

      emailContent += `
        Student Name: ${student.firstName} ${student.lastName} <br />
        Assignment Title: ${assignment.title}
        <br />
        <br />
        `;
    }

    sendSubmissionNotice(lecturerEmail, emailContent);
  }
});
