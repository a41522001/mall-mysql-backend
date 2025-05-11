import { Request, Response, NextFunction } from 'express';
import authService from '../services/authService.ts';
import ResponseModel from "../models/responseModel.ts";
import { getUserInfo } from '../utils/index.ts';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    await authService.signup(name, email, password);
    res.status(200).json(ResponseModel.successResponse(null, '創建成功, 請登入'));
  } catch (error) {
    next(error);
  }
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const token = await authService.login(email, password);
    res.status(200).json(ResponseModel.loginResponse('登入成功', token, 100));
  } catch (error) {
    next(error);
  }
}
export const userInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getUserInfo(req);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}