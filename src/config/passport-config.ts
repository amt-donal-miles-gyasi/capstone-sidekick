import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { User } from '../models';
import { prisma } from './prisma-connection';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'loginId',
    },
    async (loginId, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: loginId }, { loginId }],
          },
        });

        if (!user) {
          return done(null, false, {
            message: 'Invalid email! Please verify and try again.',
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, {
            message: 'Wrong password! Please verify and try again.',
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
