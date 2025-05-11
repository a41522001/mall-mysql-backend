import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
interface CartType {
  userId: string;
  productId: string;
  quantity: number;
}
export class Carts
extends Model<CartType>
implements CartType {
  public userId!: string;
  public productId!: string;
  public quantity!: number;
}
Carts.init({
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Carts',
  timestamps: false,
  sequelize
})