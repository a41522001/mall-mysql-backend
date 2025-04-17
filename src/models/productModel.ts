import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
interface ProductType {
  id: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}
export class Products 
extends Model<ProductType>
implements ProductType {
  public id!: string;
  public quantity!: number;
  public price!: number;
  public name!: string;
  public image?: string;
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
  }
}, {
  tableName: 'Products',
  timestamps: false,
  sequelize
})