import { Products } from '../models/productModel.ts';
import { Orders } from '../models/orderModel.ts';
import { Carts } from '../models/cartModel.ts';
import { OrderItems } from '../models/OrderItemsModel.ts';
import { sequelize } from '../config/sequelize.ts';
import { getToday, getCurrentTime } from '../utils/index.ts';
import { v4 as uuidv4 } from 'uuid';
import type { ProductDetail } from '../types/product.ts';
import { Transaction, Op } from 'sequelize';
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
      throw new Error('發生未知錯誤');
    }
  }
  // 新增訂單
  async addOrder(cartList: any, total: number, userId: string): Promise<string> {
    const t = await sequelize.transaction();
    const todayDate = getToday();
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
        const currentProduct = await this.getProductDetail(cart.productID, t);
        const { 
          currentProductName, 
          currentProductStock, 
          currentProductPrice, 
          currentProductId 
        } = currentProduct;

        if(currentProductStock >= cart.quantity) {
          // 創建子訂單
          await this.createOrderItem(orderID, currentProductId, cart.quantity, currentProductPrice, t);
          // 扣除購物車數量
          await this.decreaseCartQuantity(currentProductId, userId, cart.quantity, t);
          // 扣除商品數量
          await this.decreaseProductQuantity(currentProductId, cart.quantity, t);
        }else {
          throw new Error(`${currentProductName}目前庫存不足, 最多可購入${currentProductStock}件`);
        }
      }
      await t.commit();
      return orderID;
    } catch (error: any) {
      await t.rollback();
      // console.error(error);
      throw new Error(error);
    }
  }
  // 得到商品名稱 庫存 價格 ID
  private async getProductDetail(productID: string, t: Transaction): Promise<ProductDetail> {
    const res = await Products.findOne({
      attributes: ['quantity', 'name', 'price', 'id'],
      where: {
        id: productID
      },
      lock: t.LOCK.UPDATE,
      raw: true,
      transaction: t
    });
    if(res) {
      const { name, quantity, price, id } = res;
      return {
        currentProductName: name,
        currentProductStock: quantity,
        currentProductPrice: price,
        currentProductId: id
      }
    }else {
      throw new Error('發生未知錯誤');
    }
  }
  // 創建子訂單
  private async createOrderItem(orderID: string, productID: string, quantity: number, price: number, t: Transaction) {
    try {
      await OrderItems.create({
        id: uuidv4(),
        orderId: orderID,
        productId: productID,
        price: price,
        quantity: quantity
      }, { transaction: t })
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
  // 扣除商品庫存數量
  private async decreaseProductQuantity(productId: string, decrementQuantity: number, t: Transaction) {
    try {
      await Products.decrement('quantity', {
        where: {
          id: productId
        },
        by: decrementQuantity,
        transaction: t
      });
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
  // 扣除購物車庫存數量
  private async decreaseCartQuantity(productId: string, userId: string, decrementQuantity: number, t: Transaction) {
    try {
      // 先扣除數量
      await Carts.decrement('quantity', {
        by: decrementQuantity,
        where: {
          productId: productId,
          userId: userId
        },
        transaction: t
      });
      // 再判斷數量是否為零或以下 可否清除
      await Carts.destroy({
        where: {
          productId: productId,
          userId: userId,
          quantity: {
            [Op.lte]: 0
          }
        },
        transaction: t
      });
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
}
export default new OrderModel();