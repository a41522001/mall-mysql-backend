import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.ts';
import { Products } from './productModel.ts';
import { Orders } from './orderModel.ts';
import { UserInfo } from "./authModel.ts";
import { Carts } from "./cartModel.ts";
import { OrderItems } from "./orderItemsModel.ts";

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