import express, { Request, Response, Router } from 'express';
import passport from '../config/passport-config';
import { signJWT } from '../utilities/jwt-utils';
import { User } from '../models';

const router: Router = express.Router();

router.post('/login', (req: Request, res: Response, next) => {
  passport.authenticate('local', (err: Error, user: User, next) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ message: next.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Internal server error' });
      }

      const token = signJWT({ userId: user.id });

      res.status(200).json({ message: 'Login successful', token });
    });
  })(req, res, next);
});

router.post('/logout', (req: Request, res: Response, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
  res.status(200).json({ message: 'Logout successful' });
});

export default router;
