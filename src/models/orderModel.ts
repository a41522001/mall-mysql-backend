import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.js';
import { UserInfo } from "./authModel.js";
import type { Status } from '../types/order.js';
interface OrderType {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  createdDate: string;
  createdTime: string;
  address: string;
  phone: string;
  receiverName: string;
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
  public phone!: string;
  public receiverName!: string;
}
Orders.init({
  id: {
    type: DataTypes.CHAR(11),
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: {
      model: UserInfo,
      key: 'id'
    }
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
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  receiverName: {
    type: DataTypes.STRING(45),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: false,
  sequelize
})