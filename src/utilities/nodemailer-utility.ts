import nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from '../config/variables';

const SMTPPort: number = +config.SMTP_PORT;

let serverPort: number | string;

config.NODE_ENV === 'production'
  ? (serverPort = '')
  : (serverPort = `:${+config.SERVER_PORT}`);

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
  roleId: string,
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
                Kindly <a target="_blank" href="${config}${serverPort}/api/verify-${role}"> click here</a> to login using the following credentials.
                <br /><br />
                <span style="font-weight: bold">${role}:</span> ${roleId}
                <span style="font-weight: bold">Temporary password:</span> ${password}

                PS: It is recommended to change password upon initial login.
              </p>`,
    })
    .catch((err) => err);
};

export const sendAssignmentInvite = async (
  name: string,
  email: string,
  token: string
): Promise<void> => {
  await transport
    .sendMail({
      from: `Git Inspired <${config.EMAIL_ADDRESS}>`,
      to: email,
      subject: 'Please confirm your account',
      html: `<h2>Hello, ${name},</h2>
              <p>
                You have been invited to partake in this assignment, [TITLE] before [DEADLINE DATE].
                Use this [CODE] to submit your assignment
                
                <a target="_blank" href="${config.CLIENT_HOST}${serverPort}/api/verify-email/${token}"> Click here</a>
              </p>`,
    })
    .catch((err) => err);
};
