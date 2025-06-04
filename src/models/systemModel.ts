import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
interface SystemType {
  sysNo: string;
  prop: string;
  name: string;
}
export class SystemSetting
extends Model<SystemType>
implements SystemType {
  public sysNo!: string;
  public prop!: string;
  public name!: string;
}
SystemSetting.init({
  sysNo: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  prop: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false
  }
}, {
  tableName: 'systemsetting',
  timestamps: false,
  sequelize
})