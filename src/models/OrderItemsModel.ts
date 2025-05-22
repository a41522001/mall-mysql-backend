import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
export const OrderItems = sequelize.define('OrderItems', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  orderId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'orderitems',
  timestamps: false
}
)