import { Request, Response } from 'express';
import ResponseModel from '../models/responseModel.ts';
import checkoutService from '../services/checkoutService.ts';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';
import axios from 'axios';
import { decryptTradeInfo } from '../utils/index.ts';
export const testNotify = async (req: Request, res: Response) => {
  console.log('這是通知');
  console.log(req.query);
  
  console.log(req.body);
  
}
export const testReturn = async (req: Request, res: Response) => {
  console.log('這是返回');
  // console.log(req.body);
  // const { TradeInfo } = req.body;
  // const decode = decryptTradeInfo(TradeInfo);
  // console.log(decode);
  // res.redirect('https://ead0-36-229-145-242.ngrok-free.app/buyer')
  res.send('1|OK');
}