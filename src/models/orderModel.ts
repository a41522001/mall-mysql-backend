import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';

export const Orders = sequelize.define('Orders', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  createdDate: {
    type: DataTypes.STRING(8),
    allowNull: false
  },
  createdTime: {
    type: DataTypes.STRING(8),
    allowNull: false
  }
}, {
  tableName: 'Orders',
  timestamps: false
}
)