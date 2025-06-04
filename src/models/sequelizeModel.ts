import { DataTypes } from "sequelize";
import { sequelize } from '../config/sequelize.js';
import { UserInfo } from "./authModel.js";
import { Products } from './productModel.js';
import { Carts } from "./cartModel.js";
import { Orders } from './orderModel.js';
import { OrderItems } from "./orderItemsModel.js";
import { Payments } from "./paymentModel.js";


// 一對一
Products.belongsTo(UserInfo, {
  foreignKey: 'sellUserId',
  as: 'seller'
})
Carts.belongsTo(UserInfo, {
  foreignKey: 'userId',
  as: 'cartUser'
})
Carts.belongsTo(Products, {
  foreignKey: 'productId',
  as: 'cartProduct'
})
Orders.belongsTo(UserInfo, {
  foreignKey: 'userId',
  as: 'userOrder'
})
OrderItems.belongsTo(Products, {
  foreignKey: 'productId',
  as: 'productOrderItem'
})
OrderItems.belongsTo(Orders, {
  foreignKey: 'orderId',
  as: 'orderOrderItem'
})
Payments.belongsTo(UserInfo, {
  foreignKey: 'userId',
  as: 'payer'
})
Payments.belongsTo(Orders, {
  foreignKey: 'orderId',
  as: 'paymentOrder'
})

// 一對多
UserInfo.hasMany(Products, {
  foreignKey: 'sellUserId',
  as: 'sellerProduct'
})
UserInfo.hasMany(Carts, {
  foreignKey: 'userId',
  as: 'cartOfUser'
})
UserInfo.hasMany(Orders, {
  foreignKey: 'userId',
  as: 'userOrder'
})
UserInfo.hasMany(Payments, {
  foreignKey: 'userId',
  as: 'userPayment'
})
Products.hasMany(Carts, {
  foreignKey: 'productId',
  as: 'cartOfProduct'
})
Products.hasMany(OrderItems, {
  foreignKey: 'productId',
  as: 'orderItemProduct'
})
Orders.hasMany(OrderItems, {
  foreignKey: 'orderId',
  as: 'orderItemOrder'
});
Orders.hasMany(Payments, {
  foreignKey: 'orderId',
  as: 'orderPayment'
})

//多對多
UserInfo.belongsToMany(Products, {
  through: Carts,
  foreignKey: 'userId',
  otherKey: 'productId',
  as: 'productsInCart' 
});
Products.belongsToMany(UserInfo, {
  through: Carts,
  foreignKey: 'productId',
  otherKey: 'userId',
  as: 'userInCart'
})
Orders.belongsToMany(Products, {
  through: OrderItems,
  foreignKey: 'orderId',
  otherKey: 'productId',
  as: 'productInOrderItem'
})
Products.belongsToMany(Orders, {
  through: OrderItems,
  foreignKey: 'productId',
  otherKey: 'orderId',
  as: 'orderInOrderItem'
})
export {
  sequelize,
  UserInfo,
  Products,
  Carts,
  Orders,
  OrderItems,
  Payments,
};