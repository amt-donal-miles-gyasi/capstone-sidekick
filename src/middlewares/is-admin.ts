import { Response } from "express";

export const isAdmin = (req, res:Response, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Unauthorized' });
};
