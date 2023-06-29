export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      NODE_ENV: 'production' | 'development' | 'test';
    }
  }
}
