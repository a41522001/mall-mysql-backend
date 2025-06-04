import bcrypt from 'bcrypt';
import { query } from '../db.js';
import { createToken } from '../utils/index.js';
import { sequelize } from '../config/sequelize.js';
import type { ComparePad } from '../types/auth.js';
import { UserInfo } from '../models/authModel.js';
import ApiError from '../models/errorModel.js';
import { v4 as uuidv4 } from 'uuid';
class AuthModel {
  // 註冊
  async signup(name: string, email: string, pwd: string) {
    const result = await UserInfo.findOne({
      where: {
        email: email
      },
      raw: true
    })
    if(result) {
      throw new ApiError('帳號已存在', 400);
    }
    // 密碼加鹽
    const saltRounds = 10;
    const bcryptPwd = await bcrypt.hash(pwd, saltRounds);
    await UserInfo.create({
      id: uuidv4(),
      email: email,
      password: bcryptPwd,
      name: name
    })
  }
  private async getPad(email: string): Promise<{password: string, id: string} | null> {
    return await UserInfo.findOne({
      where: {
        email: email
      },
      attributes: ['id', 'password'],
      raw: true
    })
  }
  // 登入
  async login(email: string, pwd: string): Promise<string> {
    const result = await this.getPad(email);
    if(!result) {
      throw new ApiError('帳號密碼錯誤', 400);
    }
    const { id, password } = result;
    const isPasswordExist = await bcrypt.compare(pwd, password);
    if(isPasswordExist) {
      return createToken(id, email);
    }else {
      throw new ApiError('帳號密碼錯誤', 400);
    }
  }
  // 確認Token資料
  async checkToken(id: string, email: string): Promise<number> {
    const result = await query('CALL SP_CheckToken(?, ?)', [id, email]);
    const isExist = result[0][0].isAccountExist;
    return isExist;
  }
}
export default new AuthModel();