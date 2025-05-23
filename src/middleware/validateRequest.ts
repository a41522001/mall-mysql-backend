import { Request, Response, NextFunction } from "express"
import Joi from 'joi';
import ApiError from "../models/errorModel.ts";
type RequestProperty = 'body' | 'query' | 'params'; 
export const validateRequest = (schema: Joi.Schema, property: RequestProperty = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property]);
    if(error) {
      const message = error.details[0].message;
      next(new ApiError(message, 400));
    }
    next();
  }
}