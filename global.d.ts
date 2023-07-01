export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      SESSION_SECRET: string;

      // Server variables
      SERVER_PORT: string;
      SERVER_HOST: string;
      SECRET: string;

      // Nodemailer variables
      EMAIL_SMTP: string;
      EMAIL_ADDRESS: string;
      EMAIL_PASSWORD: string;
      SMTP_PORT: string;
      NODE_ENV: string;
    }
  }
}
