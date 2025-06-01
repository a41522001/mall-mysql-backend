import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
import { UserInfo } from "./authModel.ts";
import { Products } from './productModel.ts';
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
    references: {
      model: UserInfo,
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    primaryKey: true,
    references: {
      model: Products,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'carts',
  timestamps: false,
  sequelize
})