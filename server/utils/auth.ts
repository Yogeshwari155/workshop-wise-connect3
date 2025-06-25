import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (userId: number, email: string, role: string): string => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const generateMeetLink = (): string => {
  const meetId = Math.random().toString(36).substring(2, 15);
  return `https://meet.google.com/${meetId}`;
};