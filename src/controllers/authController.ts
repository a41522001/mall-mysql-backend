import { Request, Response } from 'express';
import authService from '../services/authService.ts';
import ResponseModel from "../models/responseModel.ts";
import { getUserInfo } from '../utils/index.ts';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await authService.signup(name, email, password);
  
  if('message' in result) {
    res.status(200).json(ResponseModel.successResponse(null, result.message));
  }else {
    res.status(500).json(ResponseModel.errorResponse('伺服器錯誤', 500));
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  if(typeof token === 'string') {
    res.status(200).json(ResponseModel.loginResponse('登入成功',token, 100));
  }else {
    res.status(400).json(ResponseModel.errorResponse('帳號密碼錯誤', 400));
  }
}

export const userInfo = async (req: Request, res: Response) => {
  const result = await getUserInfo(req);
  if(result && 'id' in result) {
    res.status(200).json(ResponseModel.successResponse(result));
  }else {
    res.status(400).json(ResponseModel.errorResponse('token錯誤', 400));
  }
}