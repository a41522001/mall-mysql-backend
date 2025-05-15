import { Products } from '../models/productModel.ts';
import { sequelize } from '../config/sequelize.ts';
import { Carts } from '../models/cartModel.ts';
import ApiError from '../models/errorModel.ts';
class CartModel {
  // 新增購物車
  async addCart(productId: string, userID: string, quantity: number) {
    try {
      await sequelize.query('CALL SP_Cart(:queryString, :productID, :userID, :quantity)', {
        replacements: {
          queryString: 'AddCart',
          productID: productId,
          userID: userID,
          quantity: quantity
        }
      })
    } catch (error) {
      throw new ApiError('伺服器發生錯誤，請重新再試', 500);
    }
  }
  // 取得購物車
  async getCart(userID: string) {
    try {
      const result = await sequelize.query('CALL SP_Cart(:queryString, :productID, :userID, :quantity)', {
        replacements: {
          queryString: 'GetCart',
          productID: '',
          userID: userID,
          quantity: 0
        }
      })
      return result;
    } catch (error) {
      throw new ApiError('伺服器發生錯誤，請重新再試', 500);
    }
  }
  // 變更購物車數量
  private async changeCartQuantity(productId: string, stock: number, userID: string) {
    try {
      await Carts.update(
        { quantity: stock },
        {
          where: {
            productId: productId,
            userId: userID
          },
        },
      );
    } catch (error) {
      throw new ApiError('伺服器發生錯誤', 500);
    }
  }
  // 確認庫存
  async checkStock(productId: string, stock: number, userID: string): Promise<number | void> {
    try {
      const res = await Products.findByPk(productId, {
        attributes: ['quantity'],
        raw: true,
      })
      let quantity: number;
      if(res?.quantity) {
        quantity = res.quantity;
      }else {
        throw new ApiError('找不到此商品', 404);
      }
      if(quantity >= stock) {
        this.changeCartQuantity(productId, stock, userID);
      }else {
        throw new ApiError(`庫存不足，最多可加入 ${quantity} 件商品`, 400);
      }
    } catch (error: any) {
      if(error instanceof ApiError) {
        throw error
      }else {
        throw new ApiError('伺服器發生錯誤', 500);
      }
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
      throw new ApiError('伺服器發生錯誤', 500);
    }
  }
}
export default new CartModel();