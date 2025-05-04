import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from "express"
import { decodedToken } from "../types/auth.ts";
import { query } from '../db.ts';
import type { NewebPayTradeInfo } from '../types/payment.ts';
dotenv.config();
import crypto from 'crypto';
// 創建TOKEN
export const createToken = (userID: string, email: string) => {
  const tokenObject = { _id: userID, email: email };
  const token = jwt.sign(tokenObject, process.env.SECRET_KEY as string, { expiresIn: '4h' });
  return token;
}
// 取得user資料
export const getUserInfo = async (req: Request) => {
  const auth = req.headers.authorization;
  const token = auth!.split(' ')[1];
  const queryString = 'SELECT id, name, email FROM UserInfo WHERE id = ?'
  let id = '';
  jwt.verify(token, process.env.SECRET_KEY!, async (err, decoded) => {
    const data = decoded as decodedToken;
    if(data) {
      id = data._id;
    }else {
      return;
    }
  })
  const result = await query(queryString, [id]);
  return result[0];
}
// 取得今日日期
export const getToday = (): string => {
  const now = new Date();
  // 取得年月日並格式化成 20250325
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}
// 取得目前時間
export const getCurrentTime = (): string => {
  const now = new Date();
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `${hour}${minute}`;
}

/**
 * 解密藍新 TradeInfo
 * @param encryptedHex - 藍新回傳的 TradeInfo（大寫 HEX 字串）
 * @returns {NewebPayTradeInfo} 明文參數的物件
 */
export const decryptTradeInfo = (encryptedHex: string): NewebPayTradeInfo => {
  const key = Buffer.from(process.env.NEW_WEB_PAY_HASH_KEY!, 'utf8');
  const iv  = Buffer.from(process.env.NEW_WEB_PAY_HASH_IV!,  'utf8');
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
  `
}