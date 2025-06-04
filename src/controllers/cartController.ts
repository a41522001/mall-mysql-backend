import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.js';
import cartService from '../services/cartService.js';
import ApiError from '../models/errorModel.js';
import { getUserId } from '../utils/index.js';
// 新增購物車
export const addCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const { productId, quantity } = req.body;
    await cartService.addCart(productId, userId, quantity);
    res.status(200).json(ResponseModel.successResponse(null, '新增成功'));
  } catch (error) {
    next(error)
  }
}
// 取得購物車
export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const result = await cartService.getCart(userId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
// 更改購物車數量
export const changeCartQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const { productId, quantity } = req.body;
    await cartService.checkStock(productId, quantity, userId);
    res.status(200).json(ResponseModel.successResponse(null));
  } catch (error) {
    next(error);
  }
}
// 刪除購物車
export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const { productID } = req.query;
    if(typeof productID === 'string') {
      await cartService.deleteCart(productID, userId);
      res.status(200).json(ResponseModel.successResponse(null, '刪除成功'));
    }else {
      throw new ApiError('發生錯誤', 400);
    }
  } catch (error) {
    next(error);
  }
}