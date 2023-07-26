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
  title: string
) => {
  await transport
    .sendMail({
      from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Assignment Submission Notice',
      html: `<h2>Dear, ${name},</h2>
                <p>You have successfully submit <strong>Assignment Title:</strong> ${title}
                We will sent you an email once your assignment has been graded</p>
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

/**
 * Sends an assignment invitation email to a recipient.
 * @param {string} name - The name of the recipient.
 * @param {string} email - The email address of the recipient.
 * @param {string} title - The title of the assignment.
 * @param {Date} deadline - The deadline of the assignment.
 * @param {string} uniqueCode - The unique code for the assignment.
 * @param {string} assignmentId - The ID of the assignment.
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully.
 */
export const sendSubmissionNotice = async (
  email: string,
  emailContent: string
): Promise<void> => {
  await transport
    .sendMail({
      from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Assignment Inviation',
      html: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <meta name="viewport" content="width=div, initial-scale=1.0" />
                  <style>
                    body {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      width: 100vw;
                      height: 100vh;
                      background-color: whitesmoke;
                      font-size: clamp(14px, 3vw, 24px);

                    }
                    .template-wrapper {
                      width: 700px;
                      background-color: white;
                    }
                    .banner {
                      background-color: #363143;
                      text-align: center;
                      padding: 1.5rem 0;
                      margin-bottom: 3.5rem;
                    }
                    .hero {
                      text-align: center;
                    }
                    .hero >img {
                      width: 300px;
                      height: auto;
                    }

                    .content > p {
                      padding: 0 5rem;
                      color: #31394e;
                      margin: 4rem 0;
                    }

                    button {
                      background-color: #5d34ec;
                      color: white;
                      border-radius: 5px;
                      padding: 0.5rem 1.5rem;
                      border: none;
                      text-decoration: none;
                    }
                    .button-wrapper {
                      text-align: center;
                      margin: 3rem 0;
                    }
                  </style>
                </head>
                <body>
                  <div class="template-wrapper">
                  <div class="banner">
                    <img src="logoIT.png" alt="" />
                  </div>
                  <div class="content">
                    <p>
                      ${emailContent}
                      To access the student's submission, please click on the button below
                      to access the submissions.
                    </p>
                  </div>
                  <div class="button-wrapper"><a href="${config.CLIENT_HOST}/dashboard/lecturer/submissions"><button>View Submissions</button></a></div>
                  </div>
                </body>
              </html>
              </html>
              `,
    })
    .catch((err) => err);
};
