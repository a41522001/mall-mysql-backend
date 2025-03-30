import jwt from 'jsonwebtoken';
import { Request } from "express"
import dotenv from "dotenv";
import { decodedToken } from "../types/auth";
import { query } from '../db';
dotenv.config();

export const getUserInfo = async (req: Request) => {
  const auth = req.headers.authorization;
  const token = auth!.split(' ')[1];
  const queryString = 'SELECT id, name, email FROM UserInfo WHERE id = ?'
  let id = '';
  jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded) => {
    const { _id, email } = decoded as decodedToken;
    id = _id;
  })
  const result = await query(queryString, [id]);
  return result[0];
}