import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.js';
import OrderService from '../services/orderService.js';
import ApiError from '../models/errorModel.js';
// 取得所有訂單資訊
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params?.userId;
    try {
      if(userId && typeof userId === 'string') {
        const result = await OrderService.getOrder(userId);
        res.status(200).json(ResponseModel.successResponse(result));
      }else {
        throw new ApiError('參數不符合規定', 400);
      }
    } catch (error: any) {
      next(error);
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
// 取消訂單
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderId } = req.body
  try {
    const result = await OrderService.cancelOrder(orderId);
    res.status(200).json(ResponseModel.successResponse<string>(result));
  } catch (error: any) {
    next(error);
  }
}