import { NextFunction, Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import SystemSettingModel from '../services/systemService.ts';
// 取得商品資訊
export const getSystem = async (req: Request, res: Response, next: NextFunction) => {
  const sysNo = req.query.sysNo;
  try {
    if(typeof sysNo === 'string') {
      const result = await SystemSettingModel.getSystem(sysNo);
      res.status(200).json(ResponseModel.successResponse(result));
    }
  } catch (error) {
    next(error);
  }
}
