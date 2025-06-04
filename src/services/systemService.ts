import { SystemSetting } from '../models/systemModel.js';
import { sequelize } from '../config/sequelize.js';
import ApiError from '../models/errorModel.js';
class SystemSettingModel {
  // 取得系統設定
  async getSystem(sysNo: string) {
    try {
      const res = await SystemSetting.findAll({
        attributes: ['prop', 'name'],
        where: {
          sysNo: sysNo
        },
        raw: true
      })
      return res;
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
}
export default new SystemSettingModel();