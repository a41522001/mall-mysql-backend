import { query } from '../db';
import { testConnection, UserInfo, Products, Carts, Orders, sequelize, OrderItems } from '../models/sequelizeModel';
import { findAll } from '../services/sequelize';

import { getTodayDate } from '../services/getTodayDate';
import { getCurrentTime } from '../services/getCurrentTime';
import { v4 as uuidv4 } from 'uuid';

class OrderModel {
  // 取得訂單列表
  async getOrder(userID: string) {
    try {
      return await sequelize.query(
        'CALL SP_GetOrder(:userID)',
        {
          replacements: { userID: userID },
        }
      );
    } catch (error) {
      return '錯誤';
    }
  }
  // 新增訂單
  async addOrder(cartList: any, total: number, userId: string): Promise<string | boolean> {
    const t = await sequelize.transaction();
    const todayDate = getTodayDate();
    const currentTime = getCurrentTime();
    const orderID = uuidv4();

    try {
      await Orders.create({
        id: orderID,
        userId: userId,
        totalPrice: total,
        status: 'pending',
        createdDate: todayDate,
        createdTime: currentTime
      }, { transaction: t })
      for(const cart of cartList) {
        const productRes = await Products.findOne({
          attributes: ['quantity'],
          where: {
            id: cart.productID
          },
          lock: t.LOCK.UPDATE,
          raw: true,
          transaction: t
        }) as { quantity: number } | null;
        if(productRes) {
          const { quantity: productQuantity } = productRes;
          if(productQuantity > cart.quantity) {
            await OrderItems.create({
              id: uuidv4(),
              orderId: orderID,
              productId: cart.productID,
              price: cart.price,
              quantity: cart.quantity
            }, { transaction: t })
            const subtractedProductQuantity = productQuantity - cart.quantity;  
            await Products.update({ quantity: subtractedProductQuantity }, {
              where: {
                id: cart.productID
              },
              transaction: t
            })
            const cartRes = await Carts.findOne({
              attributes: ['quantity'],
              where: {
                productId: cart.productID,
                userId: userId
              },
              lock: t.LOCK.UPDATE,
              raw: true,
              transaction: t
            }) as { quantity: number } | null;
            if(cartRes) {
              const { quantity: cartQuantity } = cartRes;
              const subtractedCartQuantity = cartQuantity - cart.quantity;
              await Carts.update({ quantity: subtractedCartQuantity }, {
                where: {
                  productId: cart.productID,
                  userId: userId
                },
                transaction: t
              })
            }else {
              return '購物車內找不到此商品';
            }
          }else {
            t.rollback();
            return '商品庫存不足請重新選購';
          }
        }else {
          t.rollback();
          return '無此商品';
        }
      }
      await t.commit();
      return true;
    } catch (error) {
      t.rollback();
      return '發生錯誤';
    }
  }
}
export default new OrderModel();