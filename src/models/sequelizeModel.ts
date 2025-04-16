import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
import { Products } from './productModel.ts';
import { Orders } from './orderModel.ts';
import { UserInfo } from "./authModel.ts";
import { Carts } from "./cartModel.ts";
import { OrderItems } from "./OrderItemsModel.ts";
// 測試連線
export async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('成功連線到 MySQL 資料庫');
  } catch (err) {
    console.error('連線失敗:', err);
  }
}

// 關聯
UserInfo.hasMany(Orders, {
  foreignKey: 'userId',
  sourceKey: 'id'
});
Orders.belongsTo(UserInfo, {
  foreignKey: 'userId',
  targetKey: 'id'
});
// Orders -> OrderItems 一對多
Orders.hasMany(OrderItems, {
  foreignKey: 'orderId',
  sourceKey: 'id'
});
OrderItems.belongsTo(Orders, {
  foreignKey: 'orderId',
  targetKey: 'id'
});

// Products -> OrderItems 一對多
Products.hasMany(OrderItems, {
  foreignKey: 'productId',
  sourceKey: 'id'
});
OrderItems.belongsTo(Products, {
  foreignKey: 'productId',
  targetKey: 'id'
});