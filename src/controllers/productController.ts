import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel';
import ProductModel from '../models/productModel'
// 取得商品資訊
export const getProduct = async (req: Request, res: Response) => {
  const result = await ProductModel.getProductList();
  if(result) {
    res.status(200).json(ResponseModel.successResponse(result));
  }else {
    res.status(500).json(ResponseModel.errorResponse('伺服器錯誤', 500));
  }
}
// 新增商品
export const addProduct  = async (req: Request, res: Response) => {
  const { name, price, quantity } = req.body;
  if(!name || !price || !quantity ) {
    res.status(400).json(ResponseModel.errorResponse('新增失敗', 400));
    return;
  }
  const result = await ProductModel.addProduct(name, price, quantity);
  if(Array.isArray(result)) {
    res.status(200).json(ResponseModel.successResponse(null, '新增成功'));
  }else {
    res.status(500).json(ResponseModel.errorResponse('伺服器錯誤', 500));
  }
}