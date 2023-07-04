import express, { Request, Response, Router } from 'express';
import passport from '../config/passport-config';
import { User } from '../models';
import { limiter } from '../utilities/login-limiter';
import { logout } from '../controllers/authentication';
import { prisma } from '../config/prisma-connection';
import { passwordCheck } from '../controllers/reset-passwordController';

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

        res.status(200).json({ message: 'Login successful' });
      });
    }
  )(req, res, next);
});

router.post('/logout', logout);

router.get('/user', async (req: Request, res: Response) => {
  const user = await prisma.user.findMany({
    include: {
      student: true,
      lecturer: true,
    },
  });

  res.json(user);
});

router.post('/reset-password', passwordCheck);

export default router;
