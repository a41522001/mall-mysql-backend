import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
export const UserInfo = sequelize.define('UserInfo', {
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
  tableName: 'UserInfo',
  timestamps: false
}
)