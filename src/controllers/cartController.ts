import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import cartService from '../services/cartService.ts';

// 新增購物車
export const addCart = async (req: Request, res: Response) => {
  const { productId, userId, quantity } = req.body;
  const result = await cartService.addCart(productId, userId, quantity);
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
    const result = await cartService.getCart(userID);
    res.status(200).json(ResponseModel.successResponse(result));
  }else {
    res.status(400).json(ResponseModel.errorResponse('API失敗', 400));
  }
}
// 更改購物車數量
export const changeCartQuantity = async (req: Request, res: Response) => {
  const { productID, quantity, userID } = req.body;
  const isStockEnough = await cartService.checkStock(productID, quantity, userID);
  if(typeof isStockEnough === 'number') {
    res.status(404).json(ResponseModel.errorResponse(`庫存不足，最多可加入 ${isStockEnough} 件商品`, 404));
  }else {
    res.status(200).json(ResponseModel.successResponse(null));
  }
}
// 刪除購物車
export const deleteCart = async (req: Request, res: Response) => {
  const { productID, userID } = req.body;
  const result = await cartService.deleteCart(productID, userID);
  if(result) {
    res.status(500).json(ResponseModel.errorResponse(result, 500));
  }else {
    res.status(200).json(ResponseModel.successResponse(null));
  }
}