import { Request, Response, NextFunction } from 'express';
import SellService from '../services/sellServices.ts';
import ResponseModel from "../models/responseModel.ts";
import { getUserId } from '../utils/index.ts';
export const getDateItem = async (req: Request, res: Response, next: NextFunction) => {
  const period = req.query.period as string;
  try {
    const result = SellService.getDateItem(period);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
export const getSumData = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, period } = req.body;
  try {
    const result = await SellService.getSumData(userId, period);
    res.status(200).json(ResponseModel.successResponse(result))
  } catch (error) {
    next(error);
  }
}
export const getSellCount = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.query.userId as string;
  try {
    const result = await SellService.getSellCount(userId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
export const getSellOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const result = await SellService.getSellOrders(userId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
export const sellDeliver = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getUserId(req);
    const { orderId } = req.body;
    const result = await SellService.handleSellDeliver(orderId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
export const getSellOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.query;
    const result = await SellService.getSellOrderDetail(orderId as string);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;
    const result = await SellService.cancelOrder(orderId);
    res.status(200).json(ResponseModel.successResponse(result));
  } catch (error) {
    next(error);
  }
}