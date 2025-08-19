import { Response, NextFunction } from 'express';
import authService from '../services/authService.js';
import ResponseModel from '../models/responseModel.js';
import { getUserId } from '../utils/index.js';
import { RequestCustom } from '../types/interface.js';

export const signup = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  try {
    await authService.signup(name, email, password);
    res.status(200).json(ResponseModel.successResponse(null, '創建成功, 請登入'));
  } catch (error) {
    next(error);
  }
};
export const login = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const { access, refresh } = await authService.login(email, password);
    console.log(access);
    console.log(refresh);

    res.cookie('access', access, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    res.cookie('refresh', refresh, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });
    res.status(200).json(ResponseModel.loginResponse<null>('登入成功', 100, null));
  } catch (error) {
    next(error);
  }
};
export const userInfo = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const result = await authService.getUserInfo(userId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req: RequestCustom, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const { result, code } = await authService.resetPassword(name, email, password);
    res.status(200).json(ResponseModel.successResponse(result, '成功', code));
  } catch (error) {
    next(error);
  }
};
