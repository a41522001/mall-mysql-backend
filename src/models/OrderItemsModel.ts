import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
import { Products } from './productModel.ts';
import { Orders } from './orderModel.ts';
export const OrderItems = sequelize.define('OrderItems', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  orderId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: Orders,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: Products,
      key: 'id'
    }
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