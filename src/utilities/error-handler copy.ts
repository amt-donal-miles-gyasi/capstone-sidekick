import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error(err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // Unique constraint violation
      return res.status(400).json({ error: 'Duplicate entry detected' });
    } else if (err.code === 'P2003') {
      // Foreign key constraint violation
      return res.status(400).json({ error: 'Invalid reference detected' });
    }
    // Other Prisma database error occurred
    return res
      .status(500)
      .json({ error: 'An error occurred while processing the data' });
    }
    
    if (err) {
        res.status(400).json({error: err.message})
    }

  return res.status(500).json({ error: 'An unexpected error occurred' });
};
