import { User } from '@prisma/client';
import express, { Request, Response, Router } from 'express';
import passport from '../config/passport-config';
import { prisma } from '../config/prisma-connection';
import { logout } from '../controllers/authentication';
import { passwordCheck } from '../controllers/reset-passwordController';
import { isAuthenticated } from '../middlewares/authentication';
import { getProfile } from '../utilities/getProfile';
import { limiter } from '../utilities/login-limiter';

/**
 * Handles authentication for all users
 */
const router: Router = express.Router();

/**
 * Handles user login.
 *
 * @route POST /login
 * @middleware limiter - Controls login rate limiting.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {NextFunction} next - The next middleware function.
 */
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

      req.logIn(user, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Internal server error' });
        }

        const tempProfile = await getProfile(req, res);
        const profile = {
          ...tempProfile,
          role: (req.user as User).role,
          staffId: (req.user as User).loginId,
          isVerified: (req.user as User).isVerified,
        };

        res.status(200).json({ message: 'Login successful', profile });
      });
    }
  )(req, res, next);
});

router.post('/logout', logout);

/**
 * Retrieves all users.
 *
 * @route GET /users
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 */
router.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      student: true,
      lecturer: true,
    },
  });

  res.json(users);
});

router.post('/reset-password', isAuthenticated, passwordCheck);

export default router;
