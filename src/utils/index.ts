import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from "express"
import { decodedToken } from "../types/auth.ts";
import { query } from '../db.ts';
dotenv.config();

// 創建TOKEN
export const createToken = (userID: string, email: string) => {
  const tokenObject = { _id: userID, email: email };
  const token = jwt.sign(tokenObject, process.env.SECRET_KEY as string, { expiresIn: '4h' });
  return token;
}
// 取得user資料
export const getUserInfo = async (req: Request) => {
  const auth = req.headers.authorization;
  const token = auth!.split(' ')[1];
  const queryString = 'SELECT id, name, email FROM UserInfo WHERE id = ?'
  let id = '';
  jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded) => {
    const data = decoded as decodedToken;
    if(data) {
      id = data._id;
    }else {
      return;
    }
  })
  const result = await query(queryString, [id]);
  return result[0];
}
// 取得今日日期
export const getToday = (): string => {
  const now = new Date();
  // 取得年月日並格式化成 20250325
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
// 取得目前時間
export const getCurrentTime = (): string => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${hour}${minute}`;
}