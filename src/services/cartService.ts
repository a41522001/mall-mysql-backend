import { query } from '../db.ts';
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
}
export default new CartModel();