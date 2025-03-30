import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel';
import OrderModel from '../models/orderModel';
// 取得商品資訊
export const getOrder = async (req: Request, res: Response) => {
  const userID = req.query?.userID;
  if(userID && typeof userID === 'string') {
    const result = await OrderModel.getOrder(userID);
    if(typeof result === 'string') {
      res.status(400).json(ResponseModel.errorResponse(result, 400));
    }else {
      res.status(200).json(ResponseModel.successResponse(result));
    }
  }
}
// 新增訂單
export const addOrder = async (req: Request, res: Response) => {
  const { cartList, total, userId } = req.body;
  const result = await OrderModel.addOrder(cartList, total, userId);
  if(typeof result === 'string') {
    res.status(400).json(ResponseModel.errorResponse(result, 400));
    return;
  }
  if(result) {
    res.status(200).json(ResponseModel.successResponse('新增成功'));
  }
}