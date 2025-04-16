import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';

export const Products = sequelize.define('Products', {
  id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(100),
  }
}, {
  tableName: 'Products',
  timestamps: false
}
)