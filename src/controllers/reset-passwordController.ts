import { Request, Response } from 'express';
import { prisma } from '../config/prisma-connection';
import { hashPassword } from '../utilities/password-utility';

interface User {
  id: string;
}

export const passwordCheck = async (req: Request, res: Response) => {
  const user = req.user as User;

  const id = user.id;
  const { newPassword } = req.body;

  const regexLowercase = /[a-z]/;
  const regexUppercase = /[A-Z]/;
  const regexNumber = /[0-9]/;
  const regexSymbol = /[!@#$%^&*]/

  let isValid = true;

  if (newPassword.length < 8) {
    isValid = false;
    res.send('String does not meet the minimum length requirement');
  }

  if (!regexLowercase.test(newPassword)) {
    isValid = false;
    res.send('String does not contain a lowercase letter');
  }

  if (!regexUppercase.test(newPassword)) {
    isValid = false;
    res.send('String does not contain an uppercase letter');
  }

  if (!regexNumber.test(newPassword)) {
    isValid = false;
    res.send('String does not contain a number');
  }

  if (!regexSymbol.test(newPassword)) {
    isValid = false;
    res.send('String does not contain a symbol');
  }

  const hashedPassword = await hashPassword(newPassword);

  if (isValid) {
    try {
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: hashedPassword,
          isVerified: true,
        },
      });
      res.status(200).json({
        isVerified: true,
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error,
      });
    }
  }
};
