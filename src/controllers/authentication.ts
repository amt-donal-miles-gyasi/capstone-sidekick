import { Request, Response } from 'express';

export const logout = (req: Request, res: Response, next) => {
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
