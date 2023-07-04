import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if a user is authenticated.
 * If authenticated, calls the next middleware; otherwise, returns an unauthorized error.
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: 'Unauthorized' });
};
