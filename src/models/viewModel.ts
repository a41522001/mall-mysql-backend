import { DataTypes, Model } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
interface ViewSellOrderDetailType {
  image: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
  userName: string;
  email: string;
  receiverName: string;
  address: string;
  phone: string;
  status: string;
  orderId: string;
  createdDate: string;
  createdTime: string;
}
export class viewSellOrderDetail
extends Model<ViewSellOrderDetailType>
implements ViewSellOrderDetailType {
  public image!: string;
  public productName!: string;
  public price!: number;
  public quantity!: number;
  public total!: number;
  public userName!: string;
  public email!: string;
  public receiverName!: string;
  public address!: string;
  public phone!: string;
  public status!: string;
  public orderId!: string;
  public createdDate!: string;
  public createdTime!: string;
}
viewSellOrderDetail.init({
    image: {
      type: DataTypes.STRING(100),
    },
    productName: {
      type: DataTypes.STRING(40)
    },
    price: {
      type: DataTypes.INTEGER
    },
    quantity: {
      type: DataTypes.INTEGER
    },
    total: {
      type: DataTypes.INTEGER
    },
    userName: {
      type: DataTypes.STRING(30)
    },
    email: {
      type: DataTypes.STRING(50)
    },
    receiverName: {
      type: DataTypes.STRING(45)
    },
    address: {
      type: DataTypes.STRING(45)
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    status: {
      type: DataTypes.STRING(20),
    },
    orderId: {
      type: DataTypes.CHAR(11)
    },
    createdDate: {
      type: DataTypes.CHAR(8)
    },
    createdTime: {
      type: DataTypes.CHAR(8)
    }
}, {
  tableName: 'view_sellorderdetail',
  timestamps: false,
  freezeTableName: true,
  sequelize
})