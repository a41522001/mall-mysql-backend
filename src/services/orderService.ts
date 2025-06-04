import { Products } from '../models/productModel.js';
import { Orders } from '../models/orderModel.js';
import { OrderItems } from '../models/orderItemsModel.js';
import { sequelize } from '../config/sequelize.js';
import { getToday, getCurrentTime } from '../utils/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { ProductDetail } from '../types/product.js';
import type { AllOrderDetail, OrderDetail } from '../types/order.js';
import { Transaction, Op, QueryTypes, fn } from 'sequelize';
import ApiError from '../models/errorModel.js';
class OrderModel {
  // 取得訂單列表
  async getOrder(userID: string): Promise<AllOrderDetail[]> {
    try {
      const result = await sequelize.query(
        'CALL SP_GetOrder(:runType, :userID, :orderID)',
        {
          replacements: { 
            runType: 'Q',
            userID: userID ,
            orderID: ''
          }
        },
      );
      return result as AllOrderDetail[];
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
  // 取得單筆訂單資訊
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
      throw new ApiError('伺服器發生未知錯誤', 500);                                                                                                                                                                                                                                                                                                                                                                                                         
    }
  }
  // 新增訂單
  async addOrder(cartList: any, total: number, userId: string): Promise<string> {
    const t = await sequelize.transaction();
    const todayDate = getToday();
    const currentTime = getCurrentTime();
    try {
      const isOrderPendingExist = await this.checkOrderIsPending(userId, t);
      if(isOrderPendingExist) {
        const { id } = isOrderPendingExist;
        this.changeOrderStatus(id, t);
      }
      const orderID = await this.createOrderNo(t);
      await Orders.create({
        id: orderID,
        userId: userId,
        totalPrice: total,
        status: 'pending',
        createdDate: todayDate,
        createdTime: currentTime,
        address: '',
        phone: '',
        receiverName: ''
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
          throw new ApiError(`${currentProductName}目前庫存不足, 最多可購入${currentProductStock}件`, 404);
        }
      }
      await t.commit();
      return orderID;
    } catch (error: any) {
      await t.rollback();
      if(error instanceof ApiError) {
        throw error
      }else {
        throw new ApiError('伺服器發生未知錯誤', 500);
      }
    }
  }
  // 取消訂單
  async cancelOrder(orderId: string): Promise<string> {
    try {
      await Orders.update(
        { status: 'cancel' }
        , {
          where: {
            id: orderId
          }
        }
      )
      return '取消成功';
    } catch (error) {
      throw new ApiError('取消失敗請稍後再試', 500);
    }
  }
  // 生成訂單編號
  private async createOrderNo(t: Transaction): Promise<string> {
    try {
      const res = await Orders.findOne({
        attributes: [
          [
            sequelize.fn(
              'MAX', 
              sequelize.fn('SUBSTR', sequelize.col('id'), 4)), 
              'id'
          ]
        ],
        raw: true,
        transaction: t,
        lock: t.LOCK.UPDATE
      })
      const maximumLength = 8;
      const orderID = res?.id ?? '00000000';
      let orderNo = 0;
      for(let i = 0; i < orderID.length; i++) {
        if(orderID[i] !== '0') {
          orderNo += +orderID.slice(i, orderID.length);
          break;
        }
      }
      const nextNo = orderNo + 1;
      const newOrderNo = nextNo.toString().padStart(maximumLength, '0');
      const orderPrefix = 'ORD';
      return `${orderPrefix}${newOrderNo}`;
    } catch (error) {
      throw new ApiError('生成訂單失敗', 500);
    }
  }
  // 改變訂單狀態 (Pending改成Delete)
  private async changeOrderStatus(orderId: string, t: Transaction): Promise<void> {
    try {
      await Orders.update(
        { status: 'delete' },
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
      throw new ApiError('查詢待處理訂單時發生錯誤', 400);
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
      throw new ApiError('發生未知錯誤', 500);
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
      throw new ApiError('發生未知錯誤', 500);
    }
  }
}
export default new OrderModel();