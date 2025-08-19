import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import ResponseModel from '../models/responseModel.js';
import authService from '../services/authService.js';
import dotenv from 'dotenv';
import { DecodedToken, decodedToken } from '../types/auth.js';
import ApiError from '../models/errorModel.js';
import { RequestCustom } from '../types/interface.js';
import { v4 as uuidv4 } from 'uuid';
import { createAccessToken, generateRefreshTokenTime } from '../utils/index.js';
import { Token } from '../models/sequelizeModel.js';
import { Op } from 'sequelize';
dotenv.config();
export const verifyToken = async (req: RequestCustom, res: Response, next: NextFunction) => {
  const reqPath = req.path;
  // 跳過藍新金流的notify URL
  if (reqPath === '/checkoutNotify') {
    next();
  }

  // 解access token
  const cookieAccessToken = req.cookies?.access;
  if (cookieAccessToken) {
    try {
      const { sub } = jwt.verify(cookieAccessToken, process.env.SECRET_KEY!) as DecodedToken;
      req.userId = sub;
      return next();
    } catch (error: any) {
      if (error.name !== 'TokenExpiredError') {
        res.clearCookie('access', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
        res.clearCookie('refresh', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
        return next(new ApiError('請重新登入', 401));
      }
    }
  }

  // 解fresh token
  const cookieRefreshToken = req.cookies?.refresh;
  if (!cookieRefreshToken) {
    res.clearCookie('access', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
    res.clearCookie('refresh', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
    return next(new ApiError('請重新登入', 401));
  }
  const now = new Date();

  try {
    // 查refresh token
    const isRefreshTokenExist = await Token.findOne({
      where: {
        refreshToken: cookieRefreshToken,
        expiredAt: {
          [Op.gt]: now,
        },
      },
      raw: true,
    });
    console.log(isRefreshTokenExist);
    if (isRefreshTokenExist) {
      const refreshToken = uuidv4();
      const expireTime = generateRefreshTokenTime();
      const oldExpiredAt = new Date(Date.now() + 15_000); // 15s
      const userId = isRefreshTokenExist.userId;
      const [count] = await Token.update(
        {
          refreshToken: refreshToken,
          expiredAt: expireTime,
          oldRefreshToken: cookieRefreshToken,
          oldExpiredAt: oldExpiredAt,
        },
        {
          where: {
            userId: userId,
            refreshToken: cookieRefreshToken,
            expiredAt: {
              [Op.gt]: now,
            },
          },
        }
      );
      if (count === 1) {
        const accessToken = createAccessToken(userId);
        res.cookie('access', accessToken, {
          maxAge: 15 * 60 * 1000,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        });
        res.cookie('refresh', refreshToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        });
        req.userId = userId;
        return next();
      }
    }
    // 查舊的refresh token
    const isOldRefreshTokenExist = await Token.findOne({
      where: {
        oldRefreshToken: cookieRefreshToken,
        oldExpiredAt: {
          [Op.gt]: now,
        },
      },
      raw: true,
    });
    if (isOldRefreshTokenExist) {
      const userId = isOldRefreshTokenExist.userId;
      const accessToken = createAccessToken(userId);
      res.cookie('access', accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
      req.userId = userId;
      return next();
    } else {
      res.clearCookie('access', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
      res.clearCookie('refresh', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
      return next(new ApiError('請重新登入', 401));
    }
  } catch (error) {
    res.clearCookie('access', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
    res.clearCookie('refresh', { httpOnly: true, secure: false, sameSite: 'lax', path: '/' });
    return next(new ApiError('請重新登入', 401));
  }
};
