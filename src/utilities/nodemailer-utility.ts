import nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../config/variables';

const SMTPPort: number = +config.SMTP_PORT;

const poolOptions = {
  pool: true,
};

const smtpOptions = {
  host: config.EMAIL_SMTP,
  port: SMTPPort,
  secure: true, // use TLS
  auth: {
    user: config.EMAIL_ADDRESS,
    pass: config.EMAIL_PASSWORD,
  },
};

const nodemailerOptions: SMTPTransport.Options = {
  ...poolOptions,
  ...smtpOptions,
};

const transport = nodemailer.createTransport(nodemailerOptions);

export const sendAccountInvite = async (
  name: string,
  email: string,
  password: string,
  role: string,
  staffId: string
): Promise<void> => {
  await transport
    .sendMail({
      from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Welcome to Git Inspired',
      html: `<h2>Hello, ${name},</h2>
              <p>
                You have been invited to claim your free account on Git Inspired.
                <br />
                Kindly <a target="_blank" href="${config.CLIENT_HOST}/login"> click here</a> to login using the following credentials.
                <br /><br />
                <span style="font-weight: bold">${role}:</span> ${staffId}
                <br /><br />
                <span style="font-weight: bold">Temporary password:</span> ${password}

                <br /><br />
                PS: It is recommended to change password upon initial login.
              </p>`,
    })
    .catch((err) => err);
};

export const sendAssignmentInvite = async (
  name: string,
  email: string,
  title: string,
  deadline: Date,
  uniqueCode: string
): Promise<void> => {
  await transport
    .sendMail({
      from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Assignment Inviation',
      html: `<h2>Hello, ${name},</h2>
              <p>
                You have been invited to partake in this assignment, ${title} before ${deadline}.
                Use this CODE: ${uniqueCode} to submit your assignment
                <a target="_blank" href="${config.CLIENT_HOST}"> Click here</a>
              </p>`,
    })
    .catch((err) => err);
};

export const sendAssignmentConfimation = async (
  name: string,
  email: string,
  title: string,
  description: string,
  deadline: Date,
  uniqueCode: string,
  date: Date
) => {
  await transport
    .sendMail({
      from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Assignment Submission Notice',
      html: `<h2>Hello, ${name},</h2>
                <p>Thank you for your submission. We are pleased to confirm that your submission was successful.</p>
            <p>Here are the details of your submission:</p>
            <ul>
              <li><strong>Assignment Title:</strong> ${title}</li>
              <li><strong>Assignment Description:</strong> ${description}</li>
              <li><strong>Date of Submission:</strong> ${date}</li>
              <li><strong>Submission ID:</strong> ${uniqueCode}</li>
              <li><strong>Deadline:</strong> ${deadline}</li>
            </ul>
            <p>Please keep this email for your records.</p>
            <p>Best regards,</p>
            <p>Git Inspired </p>
              `,
    })
    .catch((err) => err);
};

export const sendAssignmentSubmissionNotice = async (
  lectName,
  studName,
  assTitle,
  assCode,
  email
) => {
  await transport.sendMail({
    from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
    to: email,
    subject: 'Assignment Submission Notice',
    html: `<html>
    <body>
      <h3>Dear ${lectName},</h3>
      <p>A new assignment submission has been received.</p>
      <table>
        <tr>
          <th>Student Name</th>
          <th>Assignment Title</th>
          <th>Assignment Code</th>
        </tr>
        <tr>
          <td>${studName}</td>
          <td>${assTitle}</td>
          <td>${assCode}</td>
        </tr>
      </table>
      <p>Please review the submission at your earliest convenience.</p>
      <p>Best regards,</p>
      <p>Your Organization</p>
    </body>
  </html>`,
  });
};
