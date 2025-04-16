import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
export const Carts = sequelize.define('Carts', {
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Carts',
  timestamps: false
}
)