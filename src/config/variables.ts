import * as dotenv from 'dotenv';
dotenv.config();

export default {
  // Database variables
  DATABASE_URL: process.env.DATABASE_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,

  // Server variables
  SERVER_PORT: process.env.SERVER_PORT,
  SERVER_HOST: process.env.SERVER_HOST,
  SECRET: process.env.SECRET,

  //Client variables
  CLIENT_HOST: process.env.CLIENT_HOST,

  // Nodemailer variables
  EMAIL_SMTP: process.env.EMAIL_SMTP,
  EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  SMTP_PORT: process.env.SMTP_PORT,
  NODE_ENV: process.env.NODE_ENV,

  // AWS credentials
  ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  REGION: process.env.AWS_REGION,
  BUCKET_NAME: process.env.AWS_BUCKET_NAME,
};
