import { Request, Response, NextFunction } from "express"
import Joi from 'joi';
import ApiError from "../models/errorModel.js";
type RequestProperty = 'body' | 'query' | 'params'; 
export const validateRequest = (schema: Joi.Schema, property: RequestProperty = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await schema.validateAsync(req[property], { abortEarly: false });
      req[property] = result;
      next();
    } catch (error: any) {
      const message = error.details.reduce((acc: string, item: { message: string; }) => {
        return acc + item.message + ', ';
      }, '').slice(0, -2);
      next(new ApiError(message, 400));
      return;
    }
  }
}