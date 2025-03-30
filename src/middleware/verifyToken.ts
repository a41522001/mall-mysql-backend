import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express"
import ResponseModel from "../models/responseModel";
import authModel from '../models/authModel';
import dotenv from "dotenv";
import { decodedToken } from "../types/auth";
dotenv.config();
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

  
  const auth = req.headers.authorization;
  if(!auth || !auth.startsWith('Bearer ')) {
    res.status(400).json(ResponseModel.errorResponse('未授權', 400));
    return;
  }
  const token = auth.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded) => {
    if(err) {
      if(err.name === 'JsonWebTokenError') {
        res.status(400).json(ResponseModel.errorResponse('無效Token', 400));
        return;
      }
      if(err.name === "TokenExpiredError") {
        res.status(400).json(ResponseModel.errorResponse('Token已過期', 400));
        return;
      }
      res.status(500).json(ResponseModel.errorResponse('伺服器錯誤', 500));
    }else {
      const { _id, email } = decoded as decodedToken;
      const isExist = await authModel.checkToken(_id, email);
      if(isExist) {
        next();
      }else {
        res.status(400).json(ResponseModel.errorResponse('發生未預期的錯誤', 400));
        return;
      }
    }
  })
}