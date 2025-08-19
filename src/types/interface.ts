import { Request, Response, NextFunction } from 'express';
export interface SellSumData {
  createdDate: string;
  sum: number;
}
export type Period = 'month' | 'season' | 'halfYear' | 'year';
export interface RequestCustom extends Request {
  userId?: string;
}
