import { Products } from '../models/productModel.ts';
import { Orders } from '../models/orderModel.ts';
import { Carts } from '../models/cartModel.ts';
import { OrderItems } from '../models/orderItemsModel.ts';
import { sequelize } from '../config/sequelize.ts';
import { getToday, getCurrentTime } from '../utils/index.ts';
import { v4 as uuidv4 } from 'uuid';
import type { ProductDetail } from '../types/product.ts';
import type { OrderDetail } from '../types/order.ts';
import { Transaction, Op, QueryTypes } from 'sequelize';
class OrderModel {
  // 取得訂單列表
  async getOrder(userID: string) {
    try {
      return await sequelize.query(
        'CALL SP_GetOrder(:userID)',
        {
          replacements: { userID: userID }
        },
      );
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
  async getOrderSingleDetail(userId: string, orderId: string): Promise<OrderDetail> {
    try {
      const result = await sequelize.query(
        'CALL SP_GetOrder(:runType, :userID, :orderID)',
        {
          replacements: { 
            runType: 'S',
            userID: userId,
            orderID: orderId
          }
        }
      );   
      return result[0] as unknown as OrderDetail;
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
      const isOrderPendingExist = await this.checkOrderIsPending(userId, t);
      if(isOrderPendingExist) {
        const { id } = isOrderPendingExist;
        this.changeOrderStatus(id, t);
      }
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
  // 改變訂單狀態 (Pending改成Cancel)
  private async changeOrderStatus(orderId: string, t: Transaction): Promise<void> {
    try {
      await Orders.update(
        { status: 'cancel' },
        {
          where: {
            id: orderId
          }
        }
      );
    } catch (error) {
      throw Error('發生未知錯誤');
    }
  }

  // 確認是否有已存在的pending訂單
  private async checkOrderIsPending(userID: string, t: Transaction): Promise<{ id: string } | null> {
    try {
      const res = await Orders.findOne({
        attributes: ['id'],
        where: {
          userId: userID,
          status: 'pending'
        },
        raw: true,
        transaction: t
      });
      return res as { id: string } | null;
    } catch (error) {
      throw new Error('查詢待處理訂單時發生錯誤');
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
  private async createOrderItem(orderID: string, productID: string, quantity: number, price: number, t: Transaction): Promise<void> {
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
}
export default new OrderModel();