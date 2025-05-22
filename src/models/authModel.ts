import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
interface UserInfoType {
  id: string;
  email: string;
  password: string;
  name: string;
}
export class UserInfo 
extends Model<UserInfoType>
implements UserInfoType {
  public id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
}
UserInfo.init({
id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  tableName: 'userinfo',
  timestamps: false,
  sequelize
})
