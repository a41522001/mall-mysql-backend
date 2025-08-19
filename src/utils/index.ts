import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';
import { decodedToken } from '../types/auth.js';
import type { NewebPayTradeInfo } from '../types/payment.js';
import ApiError from '../models/errorModel.js';
import { UserInfo } from '../models/authModel.js';
import crypto, { createHash, randomUUID } from 'crypto';
import type { StringValue } from 'ms';
import { RequestCustom } from '../types/interface.js';
dotenv.config();
// 創建TOKEN
export const createToken = (userID: string, email: string) => {
  const tokenObject = { _id: userID, email: email };
  const token = jwt.sign(tokenObject, process.env.SECRET_KEY as string, { expiresIn: '4h' });
  // 測試Token過期時間 設定為2000毫秒
  // const token = jwt.sign(tokenObject, process.env.SECRET_KEY as string, { expiresIn: '2000' });
  return token;
};

// 取得userID
export const getUserId = async (req: RequestCustom) => {
  if (!req.userId) throw new ApiError('請重新登入', 401);
  return req.userId;
};
// 取得今日日期
export const getToday = (): string => {
  const now = new Date();
  // 取得年月日並格式化成 20250325
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};
// 取得目前時間
export const getCurrentTime = (): string => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${hour}${minute}`;
};
/**
 * 將 Date 物件格式化為 'YYYYMMDD' 字串。
 * @param {Date} date - 要格式化的日期物件。
 * @returns {string} 'YYYYMMDD' 格式的日期字串。
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};
/**
 * 將YYYYMMDD 字串轉為 YYYY-MM-DD
 */
export const formatYYYYMMDDToSlash = (str: string): string => {
  const header = str.slice(0, 4);
  const middle = str.slice(4, 6);
  const footer = str.slice(6, 8);
  return `${header}-${middle}-${footer}`;
};
/**
 * 解密藍新 TradeInfo
 * @param encryptedHex - 藍新回傳的 TradeInfo（大寫 HEX 字串）
 * @returns {NewebPayTradeInfo} 明文參數的物件
 */
export const decryptTradeInfo = (encryptedHex: string): NewebPayTradeInfo => {
  const key = Buffer.from(process.env.NEW_WEB_PAY_HASH_KEY!, 'utf8');
  const iv = Buffer.from(process.env.NEW_WEB_PAY_HASH_IV!, 'utf8');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  decipher.setAutoPadding(true);

  const encrypted = Buffer.from(encryptedHex, 'hex');
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  const plainText = decrypted.toString('utf8').trim();
  return JSON.parse(plainText) as NewebPayTradeInfo;
};
// 藍新金流渲染 HTML FORM
export const renderHTMLForm = (gateway: string, merchantID: string, encryptedTradeInfo: string, tradeSha: string, version: string | number): string => {
  return `
    <!DOCTYPE html>
    <html>
      <body onload="document.forms[0].submit()">
        <form method="post" action="${gateway}">
          <input type="hidden" name="MerchantID"  value="${merchantID}" />
          <input type="hidden" name="TradeInfo"   value="${encryptedTradeInfo}" />
          <input type="hidden" name="TradeSha"    value="${tradeSha}" />
          <input type="hidden" name="Version"     value="${version}" />
          <input type="hidden" name="EncryptType" value="0" />
        </form>
        <p>Redirecting to NewebPay...</p>
      </body>
    </html>
  `;
};
/**
 * 創建Token
 * @param {string} userId - user.id
 * @returns {string} token
 */
export const createAccessToken = (userId: string): string => {
  const payload = {
    // issuer: env.API_URL,
    sub: userId,
    jti: createHash('sha256').update(randomUUID()).digest('hex'),
  };

  const options: SignOptions = {
    // expiresIn: env.ACCESS_TOKEN_EXPIRE as StringValue,
    expiresIn: '15m' as StringValue,
    algorithm: 'HS256',
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY!, options);
  return token;
};
// 產生refresh token到期時間
export const generateRefreshTokenTime = (): Date => {
  const days = +process.env.REFRESH_TOKEN_EXPIRE!;
  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + days);
  return expireDate;
};
