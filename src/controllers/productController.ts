import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.js';
// import ProductModel from '../models/productModel.js'
import ProductService from '../services/productService.js';
import ApiError from '../models/errorModel.js';
// 取得商品資訊
export const getProduct = async (req: Request, res: Response) => {
  const result = await ProductService.getProductList();
  if(result) {
    res.status(200).json(ResponseModel.successResponse(result));
  }else {
    res.status(500).json(ResponseModel.errorResponse('伺服器錯誤', 500));
  }
}
// 取得賣家商品資訊
export const getSellProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.query;
  try {
    if(typeof userId === 'string') {
      const result = await ProductService.getSellProductList(userId);
      res.status(200).json(ResponseModel.successResponse(result));
    }else {
      throw new ApiError('參數錯誤', 500);
    }
  } catch (error) {
    next(error);
  }
}
// 新增商品
export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, productName, price, quantity, url } = req.body;
  try {
    await ProductService.addProduct(userId, productName, price, quantity, url);
    res.status(200).json(ResponseModel.successResponse('新增商品成功'));
  } catch (error) {
    next(error);
  }
}
// 新增商品圖片
export const addProductImage = async (req: Request, res: Response) => {
  try {
    const url = await ProductService.addProductImage(req.file);
    res.status(200).json(ResponseModel.successResponse(url));
  } catch (error) {
    res.status(500).json(ResponseModel.errorResponse(`${error}`, 500));
  }
}
// 更改商品上下架狀態
export const changeProductIsActive = async (req: Request, res: Response, next: NextFunction) => {
  const { productId, isActive } = req.body;
  try {
    await ProductService.changeProductIsActive(productId, isActive);
    res.status(200).json(ResponseModel.successResponse('更改狀態成功'));
  } catch (error) {
    next(error);
  }
}