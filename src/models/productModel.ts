import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
import { UserInfo } from "./authModel.ts";
import { TINYINT } from "sequelize";
interface ProductType {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
  sellUserId: string;
  isActive: number;
}
export class Products 
extends Model<ProductType>
implements ProductType {
  public id!: string;
  public quantity!: number;
  public price!: number;
  public name!: string;
  public image?: string;
  public sellUserId!: string;
  public isActive!: number;
}
Products.init({
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
  },
  sellUserId: {
    type: DataTypes.CHAR(36),
    references: {
      model: UserInfo,
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.TINYINT
  }
}, {
  tableName: 'products',
  timestamps: false,
  sequelize
})