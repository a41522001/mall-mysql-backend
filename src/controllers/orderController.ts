import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import OrderService from '../services/orderService.ts';
// 取得所有訂單資訊
// TODO: 待重構
export const getOrder = async (req: Request, res: Response) => {
  const userId = req.params?.userId;
  if(userId && typeof userId === 'string') {
    try {
      const result = await OrderService.getOrder(userId);
      res.status(200).json(ResponseModel.successResponse(result));
    } catch (error: any) {
      res.status(500).json(ResponseModel.errorResponse(error.message, 400));
    }
  }
}
// 取得單筆訂單詳細資訊
export const getSingleOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, orderId } = req.body;
  try {
    const result = await OrderService.getOrderSingleDetail(userId, orderId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error: any) {
    next(error);
  }
}
// 新增訂單
export const addOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { cartList, total, userId } = req.body;
  try {
    const result = await OrderService.addOrder(cartList, total, userId);
    res.status(200).json(ResponseModel.successResponse<string>(result));
  } catch (error: any) {
    next(error);
  }
}