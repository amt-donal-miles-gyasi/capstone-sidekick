import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

/**
 * Middleware to check if a user is an admin.
 * If the user is authenticated and has the role of 'ADMIN', calls the next middleware; otherwise, returns a forbidden error.
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user as User).role === 'ADMIN') {
    return next();
  }

  return res.status(403).json({ message: 'Unauthorized' });
};
