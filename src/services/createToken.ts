import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const createToken = (userID: string, email: string) => {
  const tokenObject = { _id: userID, email: email };
  const token = jwt.sign(tokenObject, process.env.SECRET_KEY as string, { expiresIn: '2h' });
  return token;
}