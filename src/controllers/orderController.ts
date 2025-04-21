import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import OrderService from '../services/orderService.ts';
import { log } from 'console';
// 取得訂單資訊
export const getOrder = async (req: Request, res: Response) => {
  const userID = req.query?.userID;
  if(userID && typeof userID === 'string') {
    try {
      const result = await OrderService.getOrder(userID);
      res.status(200).json(ResponseModel.successResponse(result));
    } catch (error: any) {
      res.status(500).json(ResponseModel.errorResponse(error.message, 400));
    }
  }
}
// 新增訂單
export const addOrder = async (req: Request, res: Response) => {
  const { cartList, total, userId } = req.body;
  try {
    const result = await OrderService.addOrder(cartList, total, userId);
    res.status(200).json(ResponseModel.successResponse<string>(result));
  } catch (error: any) {
    res.status(400).json(ResponseModel.errorResponse(error.message, 400));
  }
}