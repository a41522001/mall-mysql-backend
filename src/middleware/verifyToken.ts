import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express"
import ResponseModel from "../models/responseModel.js";
import authService from '../services/authService.js';
import dotenv from "dotenv";
import { decodedToken } from "../types/auth.js";
dotenv.config();
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const reqPath = req.path;
  // 跳過藍新金流的notify URL
  if(reqPath === '/checkoutNotify') {
    next();
  }
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) {
    res.status(400).json(ResponseModel.errorResponse('未授權', 401));
    return;
  }
  const token = auth.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded) => {
    if(err) {
      if(err.name === 'JsonWebTokenError') {
        res.status(400).json(ResponseModel.errorResponse('無效Token', 401));
        return;
      }
      if(err.name === "TokenExpiredError") {
        res.status(400).json(ResponseModel.errorResponse('Token已過期', 401));
        return;
      }
      res.status(500).json(ResponseModel.errorResponse('伺服器錯誤', 500));
    }else {
      const { _id, email } = decoded as decodedToken;
      const isExist = await authService.checkToken(_id, email);
      if(isExist) {
        next();
      }else {
        res.status(400).json(ResponseModel.errorResponse('發生未預期的錯誤', 401));
        return;
      }
    }
  })
}