import { Request, Response, NextFunction } from 'express';
import SellService from '../services/sellServices.js';
import ResponseModel from '../models/responseModel.js';
import { getUserId } from '../utils/index.js';
import { Period } from '../types/interface.js';
// 取得chartItem
export const getDateItem = async (req: Request, res: Response, next: NextFunction) => {
  const period = req.query.period as Period;
  try {
    const result = SellService.getDateItem(period);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
// 取得chartData
export const getSumData = async (req: Request, res: Response, next: NextFunction) => {
  const { period } = req.body;
  const userId = await getUserId(req);
  try {
    const result = await SellService.getSumData(userId, period);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
// 取得銷售數量 (本月前五名)
export const getSellCount = async (req: Request, res: Response, next: NextFunction) => {
  const userId = await getUserId(req);
  try {
    const result = await SellService.getSellCount(userId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
// 取得賣家所有訂單
export const getSellOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const result = await SellService.getSellOrders(userId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
// 寄送商品
export const sellDeliver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    const result = await SellService.handleSellDeliver(orderId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
// 取得訂單詳情
export const getSellOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.query;
    const result = await SellService.getSellOrderDetail(orderId as string);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
// 取消訂單
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    const result = await SellService.cancelOrder(orderId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
};
