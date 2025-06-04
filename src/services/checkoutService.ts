import { Products } from '../models/productModel.js';
import { Orders } from '../models/orderModel.js';
import { Carts } from '../models/cartModel.js';
import { OrderItems } from '../models/orderItemsModel.js';
import { sequelize } from '../config/sequelize.js';
import { renderHTMLForm, decryptTradeInfo } from '../utils/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { ProductDetail } from '../types/product.js';
import { Transaction, Op, where } from 'sequelize';
import { encryptAES, createTradeSha } from '../utils/encrypt.js';
import type { CheckoutProduct } from '../types/product.js';
import type { OrderDetail } from '../types/order.js';
import type { NewebPayTradeInfo } from '../types/payment.js';
import { Payments } from '../models/paymentModel.js';
import ApiError from '../models/errorModel.js';
class CheckoutModel {
  // 結帳
  async checkout (email: string, name: string, orderID: string, products: CheckoutProduct[], 
    total: number, userID: string, address: string, phone: string, receiverName: string): Promise<string> {

    const t = await sequelize.transaction();
    try {
      await this.updateOrderInfo(orderID, 'paying', address, phone, receiverName, t);
      t.commit();
    } catch (error: any) {
      t.rollback();
      return error.message;
    }
    const productDetailString = products.reduce((initString: string, item: CheckoutProduct) => {
      const { productName, quantity } = item;
      const product = `${productName} x${quantity}`;
      return initString + product + ', '
    }, '').trim();
    const sliceProductString = productDetailString.slice(0, productDetailString.length - 1);

    const payload = {
      MerchantID:    process.env.NEW_WEB_PAY_SHOP_ID!,
      RespondType:   'JSON',
      TimeStamp:     Math.floor(Date.now() / 1000),
      Version:       process.env.NEW_WEB_PAY_VERSION!,
      MerchantOrderNo: 'TEST' + Date.now(),
      Amt:           total,
      ItemDesc: sliceProductString,
      Email:         email,
      // ReturnURL:     process.env.NEW_WEB_PAY_RETURN_URL!,
      NotifyURL:     `${process.env.NEW_WEB_PAY_NOTIFY_URL!}?orderId=${orderID}`,
    };
    // 1. 準備明文字串
    const paramString = new URLSearchParams({
      MerchantID:    payload.MerchantID,
      RespondType:   payload.RespondType,
      TimeStamp:     String(payload.TimeStamp),
      Version:       payload.Version,
      MerchantOrderNo: payload.MerchantOrderNo,
      Amt:           String(payload.Amt),
      ItemDesc:      payload.ItemDesc,
      Email:         payload.Email,
      // ReturnURL:     payload.ReturnURL,
      ClientBackURL: `${process.env.FRONT_END_URL!}/buyer`,
      NotifyURL:     payload.NotifyURL,
    }).toString();
    // 2. 加密
    const encryptedTradeInfo = encryptAES(paramString);
    // 3. 用 encryptedTradeInfo 再去產生 TradeSha
    const tradeSha = createTradeSha(encryptedTradeInfo);
    // 4. 回一段 HTML form，使用者瀏覽器會自動提交到 NewebPay
    const gateway = process.env.NEW_WEB_PAY_URL!;
    const formHTML = renderHTMLForm(gateway, payload.MerchantID, encryptedTradeInfo, tradeSha, payload.Version);
    return formHTML;
  }
  
  // 結帳通知
  async checkoutNotify(orderId: string, paymentDetail: any) {
    const t = await sequelize.transaction();
    try {
      // 因藍新金流會跳轉多次 所以先查訂單狀態
      // 如果是paid(代表已經改變訂單付款狀態)的話就return不要再多做操作
      const status = await this.queryOrderStatus(orderId, t);
      if(status === 'paid') return;
      // 更改訂單狀態
      await this.changeOrderStatus(orderId, t, 'paid');
      const orderDetail = await this.queryOrderDetail(orderId, t);
      const { userID, products } = orderDetail;
      for(const product of products) {
        await this.decreaseCartQuantity(product.productID, userID, product.quantity, t);
        await this.decreaseProductQuantity(product.productID, product.quantity, t);
      }
      // 建立結帳資訊
      const data = decryptTradeInfo(paymentDetail.TradeInfo);
      this.createPayment(data, userID, orderId, t);
      t.commit();
    } catch (error: any) {
      t.rollback();
      throw error;
    }
  }
  // 更新訂單資訊(更改狀態 新增地址, 電話, 收件人)
  private async updateOrderInfo(orderID:string, status: string, address: string, phone: string, receiverName: string, t: Transaction) {
    try {
      await Orders.update({ 
        address: address,
        status: status,
        phone: phone,
        receiverName: receiverName
      }, {
          where: {
            id: orderID,
          },
          transaction: t
        }
      );
    } catch (error) {
      throw new ApiError('發生未知錯誤', 500);
    }
  }
  // 建立付款資訊
  private async createPayment(paymentDetail: NewebPayTradeInfo, userID: string, orderID: string, t: Transaction) {
    const { Status, Message, Result } = paymentDetail;
    const { MerchantID, Amt, TradeNo, MerchantOrderNo, PaymentType, PayTime, EscrowBank } = Result;
    try {
      Payments.create({
        id: MerchantOrderNo,
        amount: Amt,
        payTime: PayTime,
        paymentType: PaymentType,
        shopId: MerchantID,
        status: Status,
        orderId: orderID,
        userId: userID,
        tradeNo: TradeNo,
        message: Message,
        bank: EscrowBank
      })
    } catch (error: any) {
      throw error;
    }
  }
  // 查詢訂單狀態
  private async queryOrderStatus(orderID: string, t: Transaction): Promise<string> {
    try {
      const result = await Orders.findOne({
        attributes: ['status'],
        where: {
          id: orderID
        },
        raw: true,
        transaction: t,
      })
      return result!.status;
    } catch (error: any) {
      throw error;
    }
  }
  // 查詢結帳後的訂單詳細資訊
  private async queryOrderDetail(orderID: string, t: Transaction): Promise<OrderDetail> {
    try {
      const result = await sequelize.query(
        'CALL SP_GetPaidOrderDetail(:orderID)',
        {
          replacements: { 
            orderID: orderID
          },
          transaction: t,
        },
      );
      return result[0] as unknown as OrderDetail
    } catch (error: any) {
      throw error;
    }
  }
  // 改變訂單狀態 pending -> paying 或 paying -> paid
  private async changeOrderStatus(orderID: string, t: Transaction, state: string): Promise<void> {
    try {
      await Orders.update(
        { status: state },
        {
          where: {
            id: orderID
          },
          transaction: t,
        }
      )
    } catch (error: any) {
      throw error;
    }
  }
  // 扣除商品庫存數量
  private async decreaseProductQuantity(productId: string, decrementQuantity: number, t: Transaction): Promise<void> {
    try {
      await Products.decrement('quantity', {
        where: {
          id: productId
        },
        by: decrementQuantity,
        transaction: t
      });
    } catch (error: any) {
      throw error;
    }
  }
  // 扣除購物車庫存數量
  private async decreaseCartQuantity(productId: string, userId: string, decrementQuantity: number, t: Transaction): Promise<void> {
    try {
      // 先扣除數量
      await Carts.decrement('quantity', {
        where: {
          productId: productId,
          userId: userId
        },
        by: decrementQuantity,
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
    } catch (error: any) {
      throw error;
    }
  }
}
export default new CheckoutModel();