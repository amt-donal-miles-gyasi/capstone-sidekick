import express, { Request, Response, Router } from 'express';
import passport from '../config/passport-config';
import { signJWT } from '../utilities/jwt-utils';
import { User } from '../models';
import { limiter } from '../utilities/login-limiter';
import { logout } from '../controllers/authentication';
import { prisma } from '../config/prisma-connection';

const router: Router = express.Router();

router.post('/login', limiter, (req: Request, res: Response, next) => {
  passport.authenticate(
    'local',
    (err: Error, user: User, next: { message: string }) => {
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
    }
  )(req, res, next);
});

router.post('/logout', logout);

router.get('/user', async (req: Request, res: Response) => {
  const user = await prisma.user.findMany();

  res.json(user);
});

export default router;
