import { Request, Response } from 'express';
import { signJWT } from '../utilities/jwt-utils';

export const onLogin = (req: Request, res: Response, id: string) => {
  const payload = { userId: id };
  const token = signJWT(payload);

  res.status(200).json({ message: 'Login successful', token });
};

export const onLogout = (req: Request, res: Response, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
  res.status(200).json({ message: 'Logout successful' });
};
