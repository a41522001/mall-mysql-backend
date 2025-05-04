import { Products } from '../models/productModel.ts';
import { Orders } from '../models/orderModel.ts';
import { Carts } from '../models/cartModel.ts';
import { OrderItems } from '../models/OrderItemsModel.ts';
import { sequelize } from '../config/sequelize.ts';
import { getToday, getCurrentTime, renderHTMLForm, decryptTradeInfo } from '../utils/index.ts';
import { v4 as uuidv4 } from 'uuid';
import type { ProductDetail } from '../types/product.ts';
import { Transaction, Op, where } from 'sequelize';
import { encryptAES, createTradeSha } from '../utils/encrypt.ts';
import type { CheckoutProduct } from '../types/product.ts';
import type { OrderDetail } from '../types/order.ts';
import type { NewebPayTradeInfo } from '../types/payment.ts';
import { Payments } from '../models/paymentModel.ts';
class CheckoutModel {
  // 結帳
  async checkout (email: string, name: string, orderID: string, products: CheckoutProduct[], total: number, userID: string): Promise<string> {
    const t = await sequelize.transaction();
    try {
      await this.changeOrderStatus(orderID, t, 'paying');
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
      // console.log('orderID: ', orderID);
      // console.log('paymentDetail: ', paymentDetail);

      // 更改訂單狀態
      await this.changeOrderStatus(orderId, t, 'paid');
      const orderDetail = await this.queryOrderDetail(orderId, t);
      const { userID, email, name, orderID, total, products } = orderDetail;
      for(const product of products) {
        await this.decreaseCartQuantity(product.productID, userID, product.quantity, t);
        await this.decreaseProductQuantity(product.productID, product.quantity, t);
      }
      // 建立結帳資訊
      const data = decryptTradeInfo(paymentDetail.TradeInfo);
      this.createPayment(data, userID, orderID, t);

      t.commit();
    } catch (error: any) {
      t.rollback();
      return error.message;
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
    } catch (error) {
      throw new Error('發生未知錯誤');
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
        raw: true
      })
      return result!.status;
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
  // 查詢結帳後的訂單詳細資訊
  private async queryOrderDetail(orderID: string, t: Transaction): Promise<OrderDetail> {
    try {
      const result = await sequelize.query(
        'CALL SP_GetOrder(:runType, :userID, :orderID)',
        {
          replacements: { 
            runType: 'Q',
            userID: '',
            orderID: orderID
          },
        }
      );
      return result[0] as unknown as OrderDetail;
    } catch (error) {
      throw new Error('發生未知錯誤');
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
          transaction: t
        }
      )
    } catch (error) {
      throw Error('伺服器發生錯誤');
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
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
  // 扣除購物車庫存數量
  private async decreaseCartQuantity(productId: string, userId: string, decrementQuantity: number, t: Transaction): Promise<void> {
    console.log(decrementQuantity);
    
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
    } catch (error) {
      throw new Error('發生未知錯誤');
    }
  }
}
export default new CheckoutModel();