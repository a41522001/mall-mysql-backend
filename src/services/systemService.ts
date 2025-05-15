import { SystemSetting } from '../models/systemModel.ts';
import { sequelize } from '../config/sequelize.ts';
import ApiError from '../models/errorModel.ts';
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