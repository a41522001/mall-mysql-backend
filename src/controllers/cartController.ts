import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import cartService from '../services/cartService.ts';

// 新增購物車
export const addCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, userId, quantity } = req.body;
  try {
    await cartService.addCart(productId, userId, quantity);
    res.status(200).json(ResponseModel.successResponse(null, '新增成功'));
  } catch (error) {
    next(error)
  }
}
// 取得購物車
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  const userID = req.query.userID;
  try {
    const result = await cartService.getCart(userID as string);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
// 更改購物車數量
export const changeCartQuantity = async (req: Request, res: Response, next: NextFunction) => {
  const { productID, quantity, userID } = req.body;
  try {
    await cartService.checkStock(productID, quantity, userID);
    res.status(200).json(ResponseModel.successResponse(null));
  } catch (error) {
    next(error);
  }
}
// 刪除購物車
export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  const { productID, userID } = req.body;
  try {
    await cartService.deleteCart(productID, userID);
    res.status(200).json(ResponseModel.successResponse(null, '刪除成功'));
  } catch (error) {
    next(error);
  }
}