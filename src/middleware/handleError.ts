import { Request, Response, NextFunction } from 'express';
import ResponseModel from "../models/responseModel.js";
interface customError extends Error {
  statusCode: number;
}
export const handleError = (err: customError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const { message = '伺服器發生錯誤', statusCode = 500 } = err;
  res.status(statusCode).json(ResponseModel.errorResponse(message, statusCode));
}