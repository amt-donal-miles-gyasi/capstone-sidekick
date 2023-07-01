import { Response } from 'express';
import { prisma } from '../config/prisma-connection';

export const emailCheck = async (req, res: Response, next) => {
  try {
    const user = await prisma.user.findFirst({
      where: { email: req.body.email },
    });

    if (user) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }

    return next();
  } catch (err) {
    // Comment
  }
};
