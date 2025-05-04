import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();
/**
 * AES-CBC + PKCS7 Padding 加密
 */
export const encryptAES = (plaintext: string): string => {
  const key = Buffer.from(process.env.NEW_WEB_PAY_HASH_KEY!, 'utf8');
  const iv  = Buffer.from(process.env.NEW_WEB_PAY_HASH_IV!, 'utf8');
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  cipher.setAutoPadding(true);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // 藍新要求大寫 hex 字串
  return encrypted.toUpperCase();
}
/**
 * 用於驗證回傳是否被竄改，SHA256( HashKey=...&TradeInfo=...&HashIV=... )
 */
export const createTradeSha = (tradeInfo: string): string => {
  const raw = `HashKey=${process.env.NEW_WEB_PAY_HASH_KEY!}` +
              `&${tradeInfo}` +
              `&HashIV=${process.env.NEW_WEB_PAY_HASH_IV!}`;
  return crypto.createHash('sha256')
        .update(raw)
        .digest('hex')
        .toUpperCase();
}