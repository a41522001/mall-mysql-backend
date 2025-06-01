import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import checkoutService from '../services/checkoutService.ts';
import dotenv from 'dotenv';
import ApiError from '../models/errorModel.ts';
dotenv.config();

// 結帳
export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  const { email, name, orderID, products, total, userID, address, phone, receiverName } = req.body;
  try {
    const formHtml = await checkoutService.checkout(email, name, orderID, products, total, userID, address, phone, receiverName);
    res.status(200).json(ResponseModel.successResponse(formHtml));
  } catch (error) {
    next(error);
  }
}

// 結帳後通知
export const checkoutNotify = async (req: Request, res: Response, next: NextFunction) => {
  const orderId = req.query.orderId;
  try {
    if(typeof orderId !== 'string') {
      throw new ApiError('發生錯誤', 500);
    }
    await checkoutService.checkoutNotify(orderId, req.body);
  } catch (error) {
    next(error);
  }
}
