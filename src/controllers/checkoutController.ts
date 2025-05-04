import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import checkoutService from '../services/checkoutService.ts';
import dotenv from 'dotenv';
dotenv.config();

// 結帳
export const checkout = async (req: Request, res: Response) => {
  const { email, name, orderID, products, total, userID } = req.body;
  try {
    const formHtml = await checkoutService.checkout(email, name, orderID, products, total, userID);
    res.status(200).json(ResponseModel.successResponse(formHtml));
  } catch (error) {
    res.status(500).json(ResponseModel.errorResponse('發生錯誤', 500));
  }
}

// 結帳後通知
export const checkoutNotify = async (req: Request, res: Response) => {
  const orderId = req.query.orderId;
  try {
    if(typeof orderId !== 'string') {
      throw Error('發生錯誤');
    }
    await checkoutService.checkoutNotify(orderId, req.body);
  } catch (error) {
    res.status(500).json(ResponseModel.errorResponse('發生錯誤', 500));
  }
}
