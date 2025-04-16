import bcrypt from 'bcrypt';
import { query } from '../db.ts';
import { createToken } from '../utils/index.ts';
import { sequelize } from '../config/sequelize.ts';
import type { ComparePad } from '../types/auth.ts';
class AuthModel {
  // 註冊
  async signup(name: string, email: string, pwd: string) {
    // 密碼加鹽
    const saltRounds = 10;
    const bcryptPwd = await bcrypt.hash(pwd, saltRounds);
    const result =  await query('CALL SP_Signup(?, ?, ?)', [name, email, bcryptPwd]);
    return result[0][0];
  }
  private async getPad(email: string) {
    return await sequelize.query('CALL SP_GetPassword(:email)', {
      replacements: { email }
    })
  }
  // 登入
  async login(email: string, pwd: string): Promise<string | boolean> {
    const result = await this.getPad(email);
    if(!('id' in result[0]) || !('password' in result[0])) {
      return false;
    }
    const { id, password } = result[0] as ComparePad;
    const isPasswordExist = await bcrypt.compare(pwd, password);
    return isPasswordExist ? createToken(id, email) : false;
  }
  // 確認Token資料
  async checkToken(id: string, email: string): Promise<number> {
    const result = await query('CALL SP_CheckToken(?, ?)', [id, email]);
    const isExist = result[0][0].isAccountExist;
    return isExist;
  }
}
export default new AuthModel();