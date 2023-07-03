import generator from 'generate-password';
import bcrypt from 'bcrypt';

export const autoGeneratePassword: string = generator.generate({
  length: 8,
  numbers: true,
  symbols: true,
  uppercase: true,
  lowercase: true,
  strict: true,
});

const saltRounds = 10; // Number of salt rounds to use for hashing

export const hashPassword = async (
  generatedPassword: string
): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password');
  }
};
