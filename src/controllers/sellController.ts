import { Request, Response, NextFunction } from 'express';
import SellService from '../services/sellServices.ts';
import ResponseModel from "../models/responseModel.ts";

export const getDateItem = async (req: Request, res: Response, next: NextFunction) => {
  const period  = req.query.period as string;
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
    console.log(result);
    
    res.status(200).json(ResponseModel.successResponse(result))
  } catch (error) {
    next(error);
  }
}