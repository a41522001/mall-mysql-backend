import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
import type { Status } from '../types/order.ts';
interface OrderType {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  createdDate: string;
  createdTime: string;
  address: string;
}
export class Orders
extends Model<OrderType>
implements OrderType {
  public id!: string;
  public userId!: string;
  public totalPrice!: number;
  public status!: string;
  public createdDate!: string;
  public createdTime!: string;
  public address!: string;
}
Orders.init({
  id: {
    type: DataTypes.CHAR(11),
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
  },
  address: {
    type: DataTypes.STRING(45),
  }
}, {
  tableName: 'Orders',
  timestamps: false,
  sequelize
})