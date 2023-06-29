import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.SESSION_SECRET;

export const signJWT = (payload: JwtPayload): string => {
  const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  return token;
};

export const verifyJWT = (token: string): string | JwtPayload => {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
