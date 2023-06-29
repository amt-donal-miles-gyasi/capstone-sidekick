import { rateLimit } from 'express-rate-limit';

const timer = 15;

export const limiter = rateLimit({
  windowMs: timer * 60 * 1000,
  max: 5,
  message: `Too many login attempts. Please try again in ${timer} minutes.`,
});
