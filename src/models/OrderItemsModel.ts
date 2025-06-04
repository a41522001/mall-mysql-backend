import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.js';
import { Products } from './productModel.js';
import { Orders } from './orderModel.js';
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