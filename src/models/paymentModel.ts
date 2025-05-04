import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
interface PaymentType {
  id: string;
  amount: number;
  payTime: string;
  paymentType: string;
  shopId: string;
  status: string;
  orderId: string;
  userId: string;
  tradeNo: string;
  message?: string;
  bank: string;
}
export class Payments 
extends Model<PaymentType>
implements PaymentType {
  public id!: string;
  public amount!: number;
  public payTime!: string;
  public paymentType!: string;
  public shopId!: string;
  public status!: string;
  public orderId!: string;
  public userId!: string;
  public tradeNo!: string;
  public message?: string;
  public bank!: string;
}
Payments.init({
  id: {
    type: DataTypes.STRING(30),
    allowNull: false,
    primaryKey: true
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payTime: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  paymentType: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  shopId: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  orderId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  userId: {
    type: DataTypes.CHAR(36),
    allowNull: false
  },
  tradeNo: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  message: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  bank: {
    type: DataTypes.STRING(10),
    allowNull: false
  }
}, {
  tableName: 'payments',
  timestamps: false,
  sequelize
})