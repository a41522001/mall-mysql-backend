import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel';
import cartModel from '../models/cartModel';

// 新增購物車
export const addCart = async (req: Request, res: Response) => {
  const { productId, userId, quantity } = req.body;
  const result = await cartModel.addCart(productId, userId, quantity);
  const message = result?.message;
  if(message) {
    res.status(200).json(ResponseModel.successResponse(null, message));
  }else {
    res.status(500).json(ResponseModel.errorResponse('新增失敗', 500));
  }
}
// 取得購物車
export const getCart = async (req: Request, res: Response) => {
  const userID = req.query?.userID;
  if(userID && typeof userID === 'string') {
    const result = await cartModel.getCart(userID);
    res.status(200).json(ResponseModel.successResponse(result));
  }else {
    res.status(400).json(ResponseModel.errorResponse('API失敗', 400));
  }
}