import { log } from 'console';
import { query } from '../db.ts';
import { Products } from '../models/productModel.ts';
import { Carts } from '../models/cartModel.ts';
class CartModel {
  // 新增購物車
  async addCart(productId: string, userID: string, quantity: number) {
    const result = await query('CALL SP_Cart(?, ?, ?, ?)', ['AddCart', productId, userID, quantity]);
    return result[0][0];
  }
  // 取得購物車
  async getCart(userID: string) {
    const result = await query('CALL SP_Cart(?, ?, ?, ?)', ['GetCart', '', userID, 0]);
    return result[0];
  }
  // 變更購物車數量
  async changeCartQuantity(productId: string, stock: number, userID: string) {
    await Carts.update(
      { quantity: stock },
      {
        where: {
          productId: productId,
          userId: userID
        },
      },
    );
  }
  // 確認庫存
  async checkStock(productId: string, stock: number, userID: string): Promise<number | void> {
    const res = await Products.findByPk(productId, {
      attributes: ['quantity'],
      raw: true,
    })
    const quantity = res!.quantity;
    if(quantity >= stock) {
      this.changeCartQuantity(productId, stock, userID);
    }else {
      return quantity
    }
  }
  // 刪除購物車
  async deleteCart(productId: string, userID: string) {
    try {
      await Carts.destroy({
        where: {
          productId: productId,
          userId: userID
        },
      });
    } catch (error) {
      return '發生錯誤';
    }
  }
}
export default new CartModel();