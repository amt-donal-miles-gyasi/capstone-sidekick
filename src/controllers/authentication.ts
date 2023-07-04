import { NextFunction, Request, Response } from 'express';

/**
 * Logs out the user and destroys the session.
 *
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }

    return req.session.destroy((err) => {
      if (err) {
        res.json({ 'Error destroying session:': err });
      }

      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logout successful' });
    });
  });
};
